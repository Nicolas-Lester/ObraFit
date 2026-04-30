from django.contrib import admin
from django.contrib.auth.models import User
from django.contrib.auth.admin import UserAdmin
from .models import PerfilUsuario, CalculoNutricional, RecetaFavorita, ProgresoAprendizaje, Logro, LogroDesbloqueado


@admin.register(PerfilUsuario)
class PerfilUsuarioAdmin(admin.ModelAdmin):
    list_display = ['user', 'nivel', 'puntos_totales', 'created_at']
    search_fields = ['user__username', 'user__email']
    readonly_fields = ['created_at', 'updated_at']


@admin.register(CalculoNutricional)
class CalculoNutricionalAdmin(admin.ModelAdmin):
    list_display = ['user', 'calorias_diarias', 'objetivo', 'fecha']
    list_filter = ['objetivo', 'genero']
    search_fields = ['user__username']
    readonly_fields = ['fecha']


@admin.register(RecetaFavorita)
class RecetaFavoritaAdmin(admin.ModelAdmin):
    list_display = ['user', 'receta_nombre', 'fecha_agregada']
    search_fields = ['user__username', 'receta_nombre']


@admin.register(ProgresoAprendizaje)
class ProgresoAprendizajeAdmin(admin.ModelAdmin):
    list_display = ['user', 'leccion_nombre', 'puntuacion', 'completada', 'intentos']
    list_filter = ['completada']
    search_fields = ['user__username', 'leccion_nombre']


@admin.register(Logro)
class LogroAdmin(admin.ModelAdmin):
    list_display = ['nombre', 'icono', 'puntos']
    search_fields = ['nombre']


@admin.register(LogroDesbloqueado)
class LogroDesbloqueadoAdmin(admin.ModelAdmin):
    list_display = ['user', 'logro', 'fecha_desbloqueado']
    search_fields = ['user__username', 'logro__nombre']
