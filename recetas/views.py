from django.shortcuts import render, get_object_or_404
from django.db.models import Q
from .models import Receta, CategoriaReceta, ContenidoEducativo, PreguntaQuiz, Logro
import random

# Vista de página de inicio
def home(request):
    context = {
        'titulo': 'Inicio - ObraFit',
        'descripcion': 'Plataforma de bienestar y nutrición para trabajadores de la construcción'
    }
    return render(request, 'index.html', context)

# Vista de calculadora nutricional
def calculadora(request):
    context = {
        'titulo': 'Calculadora Nutricional',
    }
    return render(request, 'calculadora.html', context)

# Vista de recetas
def recetas(request):
    # Obtener parámetros de filtrado
    categoria_id = request.GET.get('categoria')
    tipo_comida = request.GET.get('tipo')
    dificultad = request.GET.get('dificultad')
    busqueda = request.GET.get('q')
    
    # Query base
    recetas_list = Receta.objects.all()
    
    # Aplicar filtros
    if categoria_id:
        recetas_list = recetas_list.filter(categoria_id=categoria_id)
    if tipo_comida:
        recetas_list = recetas_list.filter(categoria__tipo_comida=tipo_comida)
    if dificultad:
        recetas_list = recetas_list.filter(dificultad=dificultad)
    if busqueda:
        recetas_list = recetas_list.filter(
            Q(nombre__icontains=busqueda) | 
            Q(descripcion__icontains=busqueda) |
            Q(ingredientes__icontains=busqueda)
        )
    
    # Obtener categorías y recetas populares
    categorias = CategoriaReceta.objects.all()
    recetas_populares = Receta.objects.filter(es_popular=True)[:6]
    
    context = {
        'titulo': 'Recetas Saludables',
        'recetas': recetas_list[:12],  # Limitar a 12 recetas por página
        'categorias': categorias,
        'recetas_populares': recetas_populares,
        'filtro_actual': {
            'categoria': categoria_id,
            'tipo': tipo_comida,
            'dificultad': dificultad,
            'busqueda': busqueda,
        }
    }
    return render(request, 'recetas.html', context)

# Vista de detalle de receta
def receta_detalle(request, receta_id):
    receta = get_object_or_404(Receta, id=receta_id)
    recetas_relacionadas = Receta.objects.filter(
        categoria=receta.categoria
    ).exclude(id=receta_id)[:3]
    
    context = {
        'titulo': f'{receta.nombre} - Recetas',
        'receta': receta,
        'recetas_relacionadas': recetas_relacionadas,
    }
    return render(request, 'recetas/detalle.html', context)

# Vista de modo aprendizaje
def aprendizaje(request):
    # Obtener contenido educativo
    articulos = ContenidoEducativo.objects.filter(tipo='articulo', activo=True)[:6]
    tips = ContenidoEducativo.objects.filter(tipo='tip', activo=True)[:4]
    contenido_destacado = ContenidoEducativo.objects.filter(es_destacado=True, activo=True).first()
    
    context = {
        'titulo': 'Modo Aprendizaje',
        'articulos': articulos,
        'tips': tips,
        'contenido_destacado': contenido_destacado,
    }
    return render(request, 'aprendizaje.html', context)

# Vista de contenido educativo
def contenido_detalle(request, contenido_id):
    contenido = get_object_or_404(ContenidoEducativo, id=contenido_id, activo=True)
    contenido_relacionado = ContenidoEducativo.objects.filter(
        tipo=contenido.tipo,
        activo=True
    ).exclude(id=contenido_id)[:3]
    
    context = {
        'titulo': f'{contenido.titulo} - Aprender',
        'contenido': contenido,
        'contenido_relacionado': contenido_relacionado,
    }
    return render(request, 'aprendizaje/detalle.html', context)

# Vista de quiz
def quiz(request):
    # Obtener preguntas aleatorias
    todas_preguntas = list(PreguntaQuiz.objects.filter(activa=True))
    preguntas = random.sample(todas_preguntas, min(10, len(todas_preguntas)))
    
    context = {
        'titulo': 'Quiz Interactivo',
        'preguntas': preguntas,
    }
    return render(request, 'aprendizaje/quiz.html', context)

# Vista de progreso
def progreso(request):
    # Obtener todos los logros disponibles
    logros = Logro.objects.all()
    
    context = {
        'titulo': 'Mi Progreso',
        'logros': logros,
    }
    return render(request, 'progreso.html', context)

# Vista de acerca de
def acerca(request):
    context = {
        'titulo': 'Acerca de ObraFit',
    }
    return render(request, 'acerca.html', context)

# Vista de contacto
def contacto(request):
    context = {
        'titulo': 'Contacto',
    }
    return render(request, 'contacto.html', context)

