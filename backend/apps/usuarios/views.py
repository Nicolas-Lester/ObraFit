from django.contrib.auth.models import User
from rest_framework import generics, status
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import PerfilUsuario, CalculoNutricional, RecetaFavorita, ProgresoAprendizaje, LogroDesbloqueado
from .serializers import (
    RegistroSerializer,
    PerfilSerializer,
    PerfilUpdateSerializer,
    CalculoInputSerializer,
    CalculoNutricionalSerializer,
    RecetaFavoritaSerializer,
    ProgresoAprendizajeSerializer,
    LogroDesbloqueadoSerializer,
)


# ─── Auth ───────────────────────────────────────────────────────────────────

class RegistroView(generics.CreateAPIView):
    """Registro de nuevos usuarios."""
    queryset = User.objects.all()
    serializer_class = RegistroSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        response = super().create(request, *args, **kwargs)
        return Response(
            {'message': '¡Cuenta creada exitosamente! Ya puedes iniciar sesión.'},
            status=status.HTTP_201_CREATED,
        )


# ─── Perfil ─────────────────────────────────────────────────────────────────

class PerfilView(generics.RetrieveUpdateAPIView):
    """Ver y actualizar el perfil del usuario autenticado."""
    permission_classes = [IsAuthenticated]

    def get_serializer_class(self):
        if self.request.method in ('PUT', 'PATCH'):
            return PerfilUpdateSerializer
        return PerfilSerializer

    def get_object(self):
        perfil, _ = PerfilUsuario.objects.get_or_create(user=self.request.user)
        return perfil

    def retrieve(self, request, *args, **kwargs):
        perfil = self.get_object()
        data = PerfilSerializer(perfil).data

        # Estadísticas adicionales
        data['total_calculos'] = CalculoNutricional.objects.filter(user=request.user).count()
        data['lecciones_completadas'] = ProgresoAprendizaje.objects.filter(
            user=request.user, completada=True
        ).count()
        data['total_logros'] = LogroDesbloqueado.objects.filter(user=request.user).count()
        data['total_favoritos'] = RecetaFavorita.objects.filter(user=request.user).count()

        return Response(data)


# ─── Calculadora ────────────────────────────────────────────────────────────

class CalculadoraView(APIView):
    """Calcula necesidades nutricionales y guarda si el usuario está autenticado."""
    permission_classes = [AllowAny]

    def post(self, request):
        serializer = CalculoInputSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        data = serializer.validated_data

        # Fórmula Harris-Benedict
        peso = data['peso']
        altura = data['altura']
        edad = data['edad']

        if data['genero'] == 'masculino':
            tmb = 88.362 + (13.397 * peso) + (4.799 * altura) - (5.677 * edad)
        else:
            tmb = 447.593 + (9.247 * peso) + (3.098 * altura) - (4.330 * edad)

        factores = {
            'sedentario': 1.2,
            'ligero': 1.375,
            'moderado': 1.55,
            'activo': 1.725,
            'muy_activo': 1.9,
        }
        calorias_base = tmb * factores[data['nivel_actividad']]

        if data['objetivo'] == 'perder':
            calorias_diarias = calorias_base - 500
        elif data['objetivo'] == 'ganar':
            calorias_diarias = calorias_base + 500
        else:
            calorias_diarias = calorias_base

        proteinas = peso * 2
        grasas = (calorias_diarias * 0.25) / 9
        carbohidratos = (calorias_diarias - proteinas * 4 - grasas * 9) / 4

        resultado = {
            'calorias_diarias': round(calorias_diarias),
            'proteinas': round(proteinas),
            'carbohidratos': round(carbohidratos),
            'grasas': round(grasas),
            'tmb': round(tmb),
        }

        # Guardar si está autenticado
        if request.user.is_authenticated:
            calculo = CalculoNutricional.objects.create(
                user=request.user,
                **data,
                **resultado,
            )
            resultado['id'] = calculo.id
            resultado['guardado'] = True

            # Actualizar puntos
            perfil, _ = PerfilUsuario.objects.get_or_create(user=request.user)
            perfil.puntos_totales += 5
            perfil.save()
        else:
            resultado['guardado'] = False

        return Response(resultado)


class HistorialCalculosView(generics.ListAPIView):
    """Historial de cálculos nutricionales del usuario."""
    serializer_class = CalculoNutricionalSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return CalculoNutricional.objects.filter(user=self.request.user)


# ─── Favoritos ──────────────────────────────────────────────────────────────

class FavoritosView(generics.ListCreateAPIView):
    serializer_class = RecetaFavoritaSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return RecetaFavorita.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class FavoritoDeleteView(generics.DestroyAPIView):
    serializer_class = RecetaFavoritaSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return RecetaFavorita.objects.filter(user=self.request.user)


# ─── Progreso ────────────────────────────────────────────────────────────────

class ProgresoView(generics.ListAPIView):
    serializer_class = ProgresoAprendizajeSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return ProgresoAprendizaje.objects.filter(user=self.request.user)


# ─── Logros ──────────────────────────────────────────────────────────────────

class LogrosView(generics.ListAPIView):
    serializer_class = LogroDesbloqueadoSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return LogroDesbloqueado.objects.filter(user=self.request.user).select_related('logro')
