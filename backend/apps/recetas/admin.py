from django.contrib import admin
from .models import CategoriaReceta, Receta, ContenidoEducativo, PreguntaQuiz


@admin.register(CategoriaReceta)
class CategoriaRecetaAdmin(admin.ModelAdmin):
    list_display = ['nombre', 'tipo_comida']
    list_filter = ['tipo_comida']


@admin.register(Receta)
class RecetaAdmin(admin.ModelAdmin):
    list_display = ['nombre', 'categoria', 'calorias', 'dificultad', 'es_popular']
    list_filter = ['dificultad', 'es_popular', 'categoria__tipo_comida']
    search_fields = ['nombre', 'descripcion', 'ingredientes']
    list_editable = ['es_popular']


@admin.register(ContenidoEducativo)
class ContenidoEducativoAdmin(admin.ModelAdmin):
    list_display = ['titulo', 'tipo', 'es_destacado', 'activo', 'orden']
    list_filter = ['tipo', 'es_destacado', 'activo']
    list_editable = ['es_destacado', 'activo', 'orden']
    search_fields = ['titulo', 'descripcion']


@admin.register(PreguntaQuiz)
class PreguntaQuizAdmin(admin.ModelAdmin):
    list_display = ['pregunta', 'respuesta_correcta', 'activa']
    list_filter = ['activa']
    list_editable = ['activa']
