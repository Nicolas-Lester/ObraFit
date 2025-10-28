from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'),
    path('calculadora/', views.calculadora, name='calculadora'),
    path('recetas/', views.recetas, name='recetas'),
    path('recetas/<int:receta_id>/', views.receta_detalle, name='receta_detalle'),
    path('aprendizaje/', views.aprendizaje, name='aprendizaje'),
    path('aprendizaje/<int:contenido_id>/', views.contenido_detalle, name='contenido_detalle'),
    path('aprendizaje/quiz/', views.quiz, name='quiz'),
    path('progreso/', views.progreso, name='progreso'),
    path('acerca/', views.acerca, name='acerca'),
    path('contacto/', views.contacto, name='contacto'),
    path('juego/', views.juego, name='juego'),
]
