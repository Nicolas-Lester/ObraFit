from django.shortcuts import render, get_object_or_404, redirect
from django.db.models import Q
from django.contrib import messages
from django.contrib.auth.decorators import login_required
from django.utils import timezone
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
    resultado = None
    
    if request.method == 'POST':
        try:
            # Obtener datos del formulario
            peso = float(request.POST.get('peso'))
            altura = float(request.POST.get('altura'))
            edad = int(request.POST.get('edad'))
            genero = request.POST.get('sexo')
            nivel_actividad = request.POST.get('actividad')
            objetivo = request.POST.get('objetivo')
            
            # Calcular TMB (Tasa Metabólica Basal) usando fórmula de Harris-Benedict
            if genero == 'masculino':
                tmb = 88.362 + (13.397 * peso) + (4.799 * altura) - (5.677 * edad)
            else:
                tmb = 447.593 + (9.247 * peso) + (3.098 * altura) - (4.330 * edad)
            
            # Factores de actividad
            factores_actividad = {
                'sedentario': 1.2,
                'ligero': 1.375,
                'moderado': 1.55,
                'activo': 1.725,
                'muy_activo': 1.9
            }
            
            # Calcular calorías diarias
            calorias_base = tmb * factores_actividad.get(nivel_actividad, 1.55)
            
            # Ajustar según objetivo
            if objetivo == 'perder':
                calorias_diarias = calorias_base - 500
            elif objetivo == 'ganar':
                calorias_diarias = calorias_base + 500
            else:  # mantener
                calorias_diarias = calorias_base
            
            # Calcular macronutrientes
            # Proteínas: 2g por kg de peso corporal
            proteinas = peso * 2
            
            # Grasas: 25-30% de calorías totales
            grasas = (calorias_diarias * 0.25) / 9  # 9 cal por gramo
            
            # Carbohidratos: resto de calorías
            calorias_proteinas = proteinas * 4
            calorias_grasas = grasas * 9
            carbohidratos = (calorias_diarias - calorias_proteinas - calorias_grasas) / 4
            
            resultado = {
                'calorias_diarias': round(calorias_diarias),
                'proteinas': round(proteinas),
                'carbohidratos': round(carbohidratos),
                'grasas': round(grasas),
                'peso': peso,
                'altura': altura,
                'edad': edad,
                'genero': genero,
                'nivel_actividad': nivel_actividad,
                'objetivo': objetivo,
            }
            
            # Guardar en la base de datos si el usuario está autenticado
            if request.user.is_authenticated:
                from usuarios.models import CalculoNutricional
                CalculoNutricional.objects.create(
                    user=request.user,
                    peso=peso,
                    altura=altura,
                    edad=edad,
                    genero=genero,
                    nivel_actividad=nivel_actividad,
                    objetivo=objetivo,
                    calorias_diarias=resultado['calorias_diarias'],
                    proteinas=resultado['proteinas'],
                    carbohidratos=resultado['carbohidratos'],
                    grasas=resultado['grasas']
                )
                messages.success(request, '¡Cálculo guardado exitosamente en tu perfil!')
            else:
                messages.info(request, 'Inicia sesión para guardar tus cálculos y ver tu historial.')
        
        except (ValueError, KeyError) as e:
            messages.error(request, 'Por favor, completa todos los campos correctamente.')
    
    # Si el usuario está autenticado, obtener su último cálculo
    ultimo_calculo = None
    if request.user.is_authenticated:
        from usuarios.models import CalculoNutricional
        ultimo_calculo = CalculoNutricional.objects.filter(user=request.user).first()
    
    context = {
        'titulo': 'Calculadora Nutricional',
        'resultado': resultado,
        'ultimo_calculo': ultimo_calculo,
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
    if request.method == 'POST':
        # Procesar resultados del quiz
        correctas = 0
        total_preguntas = 0
        
        for key, value in request.POST.items():
            if key.startswith('pregunta_'):
                total_preguntas += 1
                pregunta_id = key.split('_')[1]
                try:
                    pregunta = PreguntaQuiz.objects.get(id=pregunta_id)
                    if value == pregunta.respuesta_correcta:
                        correctas += 1
                except PreguntaQuiz.DoesNotExist:
                    continue
        
        # Calcular puntuación
        if total_preguntas > 0:
            puntuacion = int((correctas / total_preguntas) * 100)
        else:
            puntuacion = 0
        
        # Guardar progreso si el usuario está autenticado
        if request.user.is_authenticated:
            from usuarios.models import ProgresoAprendizaje, PerfilUsuario, Logro, LogroDesbloqueado
            
            # Crear o actualizar progreso
            progreso, created = ProgresoAprendizaje.objects.get_or_create(
                user=request.user,
                leccion_id='quiz_general',
                defaults={
                    'leccion_nombre': 'Quiz de Nutrición',
                    'completada': puntuacion >= 60,
                    'puntuacion': puntuacion,
                    'intentos': 1
                }
            )
            
            if not created:
                progreso.intentos += 1
                progreso.puntuacion = max(progreso.puntuacion, puntuacion)
                if puntuacion >= 60:
                    progreso.completada = True
                    progreso.fecha_completada = timezone.now()
                progreso.save()
            
            # Actualizar puntos del perfil
            perfil = request.user.perfil
            puntos_ganados = puntuacion // 10  # 10 puntos por cada 10% de aciertos
            perfil.puntos_totales += puntos_ganados
            perfil.save()
            
            # Desbloquear logro si aprobó con más del 80%
            if puntuacion >= 80:
                try:
                    logro = Logro.objects.get(nombre='Quiz Master')
                    LogroDesbloqueado.objects.get_or_create(user=request.user, logro=logro)
                except Logro.DoesNotExist:
                    pass
            
            messages.success(request, f'¡Quiz completado! Obtuviste {puntuacion}% de respuestas correctas. +{puntos_ganados} puntos.')
        
        # Mostrar resultados
        context = {
            'titulo': 'Resultados del Quiz',
            'correctas': correctas,
            'total': total_preguntas,
            'puntuacion': puntuacion,
            'aprobado': puntuacion >= 60
        }
        return render(request, 'aprendizaje/quiz_resultado.html', context)
    
    # GET - Mostrar quiz
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
    
    # Si el usuario está autenticado, obtener su progreso
    progreso_usuario = None
    quizzes_completados = 0
    puntos_totales = 0
    
    if request.user.is_authenticated:
        from usuarios.models import ProgresoAprendizaje, LogroDesbloqueado
        progreso_usuario = ProgresoAprendizaje.objects.filter(user=request.user)
        quizzes_completados = progreso_usuario.filter(completada=True).count()
        puntos_totales = request.user.perfil.puntos_totales
    
    context = {
        'titulo': 'Mi Progreso',
        'logros': logros,
        'progreso_usuario': progreso_usuario,
        'quizzes_completados': quizzes_completados,
        'puntos_totales': puntos_totales,
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

# Vista de juego interactivo
def juego(request):
    context = {
        'titulo': 'Batalla Nutricional - Juego',
    }
    return render(request, 'juego.html', context)
