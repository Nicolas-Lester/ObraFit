from django.urls import path
from . import views

urlpatterns = [
    # Auth
    path('auth/registro/', views.RegistroView.as_view(), name='registro'),

    # Perfil
    path('usuarios/perfil/', views.PerfilView.as_view(), name='perfil'),

    # Calculadora
    path('usuarios/calculadora/', views.CalculadoraView.as_view(), name='calculadora'),
    path('usuarios/calculos/', views.HistorialCalculosView.as_view(), name='historial-calculos'),

    # Favoritos
    path('usuarios/favoritos/', views.FavoritosView.as_view(), name='favoritos'),
    path('usuarios/favoritos/<int:pk>/', views.FavoritoDeleteView.as_view(), name='favorito-delete'),

    # Progreso y logros
    path('usuarios/progreso/', views.ProgresoView.as_view(), name='progreso'),
    path('usuarios/logros/', views.LogrosView.as_view(), name='logros'),
]
