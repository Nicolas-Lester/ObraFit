from rest_framework import serializers
from .models import CategoriaReceta, Receta, ContenidoEducativo, PreguntaQuiz


class CategoriaRecetaSerializer(serializers.ModelSerializer):
    class Meta:
        model = CategoriaReceta
        fields = '__all__'


class RecetaListSerializer(serializers.ModelSerializer):
    """Serializer compacto para listados."""
    categoria_nombre = serializers.CharField(source='categoria.nombre', read_only=True)
    tipo_comida = serializers.CharField(source='categoria.tipo_comida', read_only=True)
    dificultad_display = serializers.CharField(source='get_dificultad_display', read_only=True)

    class Meta:
        model = Receta
        fields = [
            'id', 'nombre', 'descripcion_corta', 'categoria', 'categoria_nombre',
            'tipo_comida', 'calorias', 'tiempo_preparacion', 'porciones',
            'dificultad', 'dificultad_display', 'costo_aproximado',
            'imagen_url', 'es_popular',
        ]


class RecetaDetailSerializer(serializers.ModelSerializer):
    """Serializer completo para detalle de receta."""
    categoria = CategoriaRecetaSerializer(read_only=True)
    dificultad_display = serializers.CharField(source='get_dificultad_display', read_only=True)
    ingredientes_lista = serializers.ListField(
        child=serializers.CharField(), source='get_ingredientes_lista', read_only=True
    )
    instrucciones_lista = serializers.ListField(
        child=serializers.CharField(), source='get_instrucciones_lista', read_only=True
    )

    class Meta:
        model = Receta
        fields = '__all__'


class ContenidoEducativoSerializer(serializers.ModelSerializer):
    tipo_display = serializers.CharField(source='get_tipo_display', read_only=True)

    class Meta:
        model = ContenidoEducativo
        fields = [
            'id', 'titulo', 'descripcion', 'tipo', 'tipo_display',
            'contenido', 'icono', 'color', 'duracion_lectura',
            'es_destacado', 'creado_en',
        ]


class PreguntaQuizSerializer(serializers.ModelSerializer):
    class Meta:
        model = PreguntaQuiz
        # No exponer respuesta_correcta en el listado
        fields = ['id', 'pregunta', 'opcion_a', 'opcion_b', 'opcion_c', 'opcion_d']


class QuizResultadoSerializer(serializers.Serializer):
    """Recibe las respuestas del usuario y devuelve la puntuación."""
    respuestas = serializers.DictField(
        child=serializers.CharField(max_length=1),
        help_text='{"<pregunta_id>": "<letra_respuesta>", ...}',
    )

    def validate_respuestas(self, value):
        letras_validas = {'a', 'b', 'c', 'd'}
        for k, v in value.items():
            if v.lower() not in letras_validas:
                raise serializers.ValidationError(
                    f"Respuesta inválida para pregunta {k}: '{v}'"
                )
        return value
