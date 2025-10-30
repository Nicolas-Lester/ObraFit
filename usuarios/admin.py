from django.contrib import admin
from .models import (
    PerfilUsuario, CalculoNutricional, RecetaFavorita,
    ProgresoAprendizaje, Logro, LogroDesbloqueado
)


@admin.register(PerfilUsuario)
class PerfilUsuarioAdmin(admin.ModelAdmin):
    list_display = ['user', 'nivel', 'puntos_totales', 'created_at']
    search_fields = ['user__username', 'user__email']
    list_filter = ['nivel', 'created_at']


@admin.register(CalculoNutricional)
class CalculoNutricionalAdmin(admin.ModelAdmin):
    list_display = ['user', 'peso', 'objetivo', 'calorias_diarias', 'fecha']
    search_fields = ['user__username']
    list_filter = ['objetivo', 'genero', 'fecha']
    date_hierarchy = 'fecha'


@admin.register(RecetaFavorita)
class RecetaFavoritaAdmin(admin.ModelAdmin):
    list_display = ['user', 'receta_nombre', 'fecha_agregada']
    search_fields = ['user__username', 'receta_nombre']
    list_filter = ['fecha_agregada']


@admin.register(ProgresoAprendizaje)
class ProgresoAprendizajeAdmin(admin.ModelAdmin):
    list_display = ['user', 'leccion_nombre', 'completada', 'puntuacion', 'intentos']
    search_fields = ['user__username', 'leccion_nombre']
    list_filter = ['completada', 'created_at']


@admin.register(Logro)
class LogroAdmin(admin.ModelAdmin):
    list_display = ['nombre', 'puntos', 'icono', 'created_at']
    search_fields = ['nombre', 'descripcion']


@admin.register(LogroDesbloqueado)
class LogroDesbloqueadoAdmin(admin.ModelAdmin):
    list_display = ['user', 'logro', 'fecha_desbloqueado']
    search_fields = ['user__username', 'logro__nombre']
    list_filter = ['fecha_desbloqueado']
