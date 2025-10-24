from django.contrib import admin
from .models import CategoriaReceta, Receta, ContenidoEducativo, PreguntaQuiz, Logro

@admin.register(CategoriaReceta)
class CategoriaRecetaAdmin(admin.ModelAdmin):
    list_display = ['nombre', 'tipo_comida', 'icono', 'color']
    list_filter = ['tipo_comida']
    search_fields = ['nombre', 'descripcion']

@admin.register(Receta)
class RecetaAdmin(admin.ModelAdmin):
    list_display = ['nombre', 'categoria', 'tiempo_preparacion', 'dificultad', 'calorias', 'es_popular']
    list_filter = ['categoria', 'dificultad', 'es_popular']
    search_fields = ['nombre', 'descripcion']
    list_editable = ['es_popular']
    
    fieldsets = (
        ('Información Básica', {
            'fields': ('nombre', 'descripcion_corta', 'descripcion', 'categoria')
        }),
        ('Información Nutricional', {
            'fields': ('calorias', 'proteinas', 'carbohidratos', 'grasas')
        }),
        ('Detalles de Preparación', {
            'fields': ('tiempo_preparacion', 'porciones', 'dificultad', 'costo_aproximado')
        }),
        ('Receta', {
            'fields': ('ingredientes', 'instrucciones', 'tips')
        }),
        ('Otros', {
            'fields': ('imagen_url', 'es_popular')
        }),
    )

@admin.register(ContenidoEducativo)
class ContenidoEducativoAdmin(admin.ModelAdmin):
    list_display = ['titulo', 'tipo', 'duracion_lectura', 'es_destacado', 'activo', 'orden']
    list_filter = ['tipo', 'es_destacado', 'activo']
    search_fields = ['titulo', 'descripcion']
    list_editable = ['es_destacado', 'activo', 'orden']

@admin.register(PreguntaQuiz)
class PreguntaQuizAdmin(admin.ModelAdmin):
    list_display = ['pregunta_corta', 'categoria', 'respuesta_correcta', 'nivel_dificultad', 'activa']
    list_filter = ['categoria', 'nivel_dificultad', 'activa']
    search_fields = ['pregunta', 'categoria']
    list_editable = ['activa']
    
    def pregunta_corta(self, obj):
        return obj.pregunta[:50] + "..." if len(obj.pregunta) > 50 else obj.pregunta
    pregunta_corta.short_description = 'Pregunta'

@admin.register(Logro)
class LogroAdmin(admin.ModelAdmin):
    list_display = ['nombre', 'puntos', 'icono', 'color']
    search_fields = ['nombre', 'descripcion']
