from django.shortcuts import render

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
    context = {
        'titulo': 'Recetas Saludables',
    }
    return render(request, 'recetas.html', context)

# Vista de modo aprendizaje
def aprendizaje(request):
    context = {
        'titulo': 'Modo Aprendizaje',
    }
    return render(request, 'aprendizaje.html', context)

# Vista de progreso
def progreso(request):
    context = {
        'titulo': 'Mi Progreso',
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

