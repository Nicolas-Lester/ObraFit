from django.urls import path
from . import views

urlpatterns = [
    # Recetas
    path('categorias/', views.CategoriaListView.as_view(), name='categorias-list'),
    path('recetas/', views.RecetaListView.as_view(), name='recetas-list'),
    path('recetas/<int:pk>/', views.RecetaDetailView.as_view(), name='receta-detail'),

    # Aprendizaje
    path('aprendizaje/', views.ContenidoListView.as_view(), name='contenido-list'),
    path('aprendizaje/<int:pk>/', views.ContenidoDetailView.as_view(), name='contenido-detail'),

    # Quiz
    path('quiz/', views.QuizPreguntasView.as_view(), name='quiz-preguntas'),
    path('quiz/resultado/', views.QuizResultadoView.as_view(), name='quiz-resultado'),
]
