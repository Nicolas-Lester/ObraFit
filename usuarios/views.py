from django.shortcuts import render, redirect
from django.contrib.auth import login, logout, authenticate
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from .forms import RegistroForm, LoginForm
from .models import PerfilUsuario, CalculoNutricional, ProgresoAprendizaje, LogroDesbloqueado


def registro_view(request):
    """Vista para registrar nuevos usuarios"""
    if request.user.is_authenticated:
        return redirect('home')
    
    if request.method == 'POST':
        form = RegistroForm(request.POST)
        if form.is_valid():
            user = form.save()
            login(request, user)
            messages.success(request, f'¡Bienvenido a ObraFit, {user.first_name}! Tu cuenta ha sido creada exitosamente.')
            return redirect('home')
        else:
            for field, errors in form.errors.items():
                for error in errors:
                    messages.error(request, error)
    else:
        form = RegistroForm()
    
    return render(request, 'usuarios/registro.html', {'form': form})


def login_view(request):
    """Vista para iniciar sesión"""
    if request.user.is_authenticated:
        return redirect('home')
    
    if request.method == 'POST':
        form = LoginForm(request, data=request.POST)
        if form.is_valid():
            username = form.cleaned_data.get('username')
            password = form.cleaned_data.get('password')
            user = authenticate(username=username, password=password)
            if user is not None:
                login(request, user)
                messages.success(request, f'¡Hola de nuevo, {user.first_name or user.username}!')
                next_url = request.GET.get('next', 'home')
                return redirect(next_url)
        else:
            messages.error(request, 'Usuario o contraseña incorrectos.')
    else:
        form = LoginForm()
    
    return render(request, 'usuarios/login.html', {'form': form})


def logout_view(request):
    """Vista para cerrar sesión"""
    nombre = request.user.first_name or request.user.username
    logout(request)
    messages.info(request, f'Hasta pronto, {nombre}. Has cerrado sesión exitosamente.')
    return redirect('home')


@login_required
def perfil_view(request):
    """Vista del perfil del usuario"""
    perfil = request.user.perfil
    
    # Obtener estadísticas del usuario
    calculos = CalculoNutricional.objects.filter(user=request.user)
    progreso = ProgresoAprendizaje.objects.filter(user=request.user)
    logros = LogroDesbloqueado.objects.filter(user=request.user).select_related('logro')
    
    context = {
        'perfil': perfil,
        'total_calculos': calculos.count(),
        'ultimo_calculo': calculos.first(),
        'lecciones_completadas': progreso.filter(completada=True).count(),
        'total_lecciones': progreso.count(),
        'logros': logros,
        'total_puntos': perfil.puntos_totales,
    }
    
    return render(request, 'usuarios/perfil.html', context)
