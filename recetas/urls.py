from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'),
    path('calculadora/', views.calculadora, name='calculadora'),
    path('recetas/', views.recetas, name='recetas'),
    path('aprendizaje/', views.aprendizaje, name='aprendizaje'),
    path('progreso/', views.progreso, name='progreso'),
    path('acerca/', views.acerca, name='acerca'),
    path('contacto/', views.contacto, name='contacto'),
]