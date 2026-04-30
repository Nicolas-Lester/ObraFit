from django.db.models import Q
from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import CategoriaReceta, Receta, ContenidoEducativo, PreguntaQuiz
from .serializers import (
    CategoriaRecetaSerializer,
    RecetaListSerializer,
    RecetaDetailSerializer,
    ContenidoEducativoSerializer,
    PreguntaQuizSerializer,
    QuizResultadoSerializer,
)


# ─── Recetas ────────────────────────────────────────────────────────────────

class CategoriaListView(generics.ListAPIView):
    queryset = CategoriaReceta.objects.all()
    serializer_class = CategoriaRecetaSerializer
    permission_classes = [AllowAny]


class RecetaListView(generics.ListAPIView):
    serializer_class = RecetaListSerializer
    permission_classes = [AllowAny]
    search_fields = ['nombre', 'descripcion', 'ingredientes']
    ordering_fields = ['nombre', 'calorias', 'tiempo_preparacion', 'costo_aproximado']

    def get_queryset(self):
        qs = Receta.objects.select_related('categoria')
        params = self.request.query_params

        categoria = params.get('categoria')
        tipo = params.get('tipo')
        dificultad = params.get('dificultad')
        busqueda = params.get('q')
        popular = params.get('popular')

        if categoria:
            qs = qs.filter(categoria_id=categoria)
        if tipo:
            qs = qs.filter(categoria__tipo_comida=tipo)
        if dificultad:
            qs = qs.filter(dificultad=dificultad)
        if busqueda:
            qs = qs.filter(
                Q(nombre__icontains=busqueda) |
                Q(descripcion__icontains=busqueda) |
                Q(ingredientes__icontains=busqueda)
            )
        if popular == 'true':
            qs = qs.filter(es_popular=True)

        return qs


class RecetaDetailView(generics.RetrieveAPIView):
    queryset = Receta.objects.select_related('categoria')
    serializer_class = RecetaDetailSerializer
    permission_classes = [AllowAny]


# ─── Aprendizaje ────────────────────────────────────────────────────────────

class ContenidoListView(generics.ListAPIView):
    serializer_class = ContenidoEducativoSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        qs = ContenidoEducativo.objects.filter(activo=True)
        tipo = self.request.query_params.get('tipo')
        if tipo:
            qs = qs.filter(tipo=tipo)
        return qs


class ContenidoDetailView(generics.RetrieveAPIView):
    queryset = ContenidoEducativo.objects.filter(activo=True)
    serializer_class = ContenidoEducativoSerializer
    permission_classes = [AllowAny]


# ─── Quiz ────────────────────────────────────────────────────────────────────

class QuizPreguntasView(generics.ListAPIView):
    """Devuelve preguntas activas del quiz (sin la respuesta correcta)."""
    serializer_class = PreguntaQuizSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        import random
        preguntas = list(PreguntaQuiz.objects.filter(activa=True))
        random.shuffle(preguntas)
        return preguntas[:10]


class QuizResultadoView(APIView):
    """Recibe respuestas, evalúa y (si hay sesión) guarda el progreso."""
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = QuizResultadoSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        respuestas = serializer.validated_data['respuestas']
        ids = [int(k) for k in respuestas.keys()]
        preguntas = {
            str(p.id): p
            for p in PreguntaQuiz.objects.filter(id__in=ids, activa=True)
        }

        correctas = sum(
            1 for pid, letra in respuestas.items()
            if pid in preguntas and preguntas[pid].respuesta_correcta == letra.lower()
        )
        total = len(preguntas)
        puntuacion = round((correctas / total) * 100) if total else 0

        # Guardar progreso si el usuario está autenticado
        if request.user.is_authenticated:
            from apps.usuarios.models import ProgresoAprendizaje, PerfilUsuario
            from django.utils import timezone

            progreso, created = ProgresoAprendizaje.objects.get_or_create(
                user=request.user,
                leccion_id='quiz_general',
                defaults={
                    'leccion_nombre': 'Quiz de Nutrición',
                    'completada': puntuacion >= 60,
                    'puntuacion': puntuacion,
                    'intentos': 1,
                    'fecha_completada': timezone.now() if puntuacion >= 60 else None,
                },
            )
            if not created:
                progreso.intentos += 1
                progreso.puntuacion = max(progreso.puntuacion, puntuacion)
                if puntuacion >= 60 and not progreso.completada:
                    progreso.completada = True
                    progreso.fecha_completada = timezone.now()
                progreso.save()

            # Sumar puntos al perfil
            puntos_ganados = puntuacion // 10
            if puntos_ganados:
                perfil, _ = PerfilUsuario.objects.get_or_create(user=request.user)
                perfil.puntos_totales += puntos_ganados
                perfil.save()

        puntos_ganados = 0
        if request.user.is_authenticated:
            puntos_ganados = puntuacion // 10

        return Response({
            'correctas': correctas,
            'total': total,
            'puntuacion': puntuacion,
            'aprobado': puntuacion >= 60,
            'puntos_ganados': puntos_ganados,
            'logros_desbloqueados': [],
        })
