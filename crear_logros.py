"""
Script para crear logros iniciales en la base de datos
Ejecutar con: python manage.py shell < crear_logros.py
"""
from usuarios.models import Logro

# Logros iniciales
logros_data = [
    {
        'nombre': 'Primer Paso',
        'descripcion': 'Creaste tu cuenta en ObraFit',
        'icono': '🎉',
        'puntos': 10
    },
    {
        'nombre': 'Calculador Experto',
        'descripcion': 'Realizaste tu primer cálculo nutricional',
        'icono': '🧮',
        'puntos': 15
    },
    {
        'nombre': 'Explorador Culinario',
        'descripcion': 'Guardaste tu primera receta favorita',
        'icono': '👨‍🍳',
        'puntos': 15
    },
    {
        'nombre': 'Estudiante Dedicado',
        'descripcion': 'Completaste tu primera lección',
        'icono': '📚',
        'puntos': 20
    },
    {
        'nombre': 'Quiz Master',
        'descripcion': 'Aprobaste un quiz con más del 80%',
        'icono': '🏆',
        'puntos': 25
    },
    {
        'nombre': 'Semana Completa',
        'descripcion': 'Usaste la plataforma por 7 días consecutivos',
        'icono': '📅',
        'puntos': 50
    },
    {
        'nombre': 'Nutrición Pro',
        'descripcion': 'Realizaste 10 cálculos nutricionales',
        'icono': '💪',
        'puntos': 50
    },
    {
        'nombre': 'Chef Saludable',
        'descripcion': 'Guardaste 20 recetas favoritas',
        'icono': '⭐',
        'puntos': 75
    },
    {
        'nombre': 'Maestro del Conocimiento',
        'descripcion': 'Completaste todas las lecciones disponibles',
        'icono': '🎓',
        'puntos': 100
    },
    {
        'nombre': 'Leyenda ObraFit',
        'descripcion': 'Alcanzaste 1000 puntos totales',
        'icono': '👑',
        'puntos': 200
    },
]

# Crear logros
for logro_info in logros_data:
    logro, created = Logro.objects.get_or_create(
        nombre=logro_info['nombre'],
        defaults={
            'descripcion': logro_info['descripcion'],
            'icono': logro_info['icono'],
            'puntos': logro_info['puntos']
        }
    )
    if created:
        print(f'✅ Logro creado: {logro.nombre}')
    else:
        print(f'⚠️  Logro ya existe: {logro.nombre}')

print(f'\n🎉 Total de logros en la base de datos: {Logro.objects.count()}')
