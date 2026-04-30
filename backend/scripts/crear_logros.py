"""
Script para crear los logros iniciales del sistema de gamificación.
Uso: python scripts/crear_logros.py
"""
import os
import sys
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.development')
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
django.setup()

from apps.usuarios.models import Logro

LOGROS = [
    {'nombre': 'Primera Calculación', 'descripcion': 'Realizaste tu primer cálculo nutricional', 'icono': '🧮', 'puntos': 10},
    {'nombre': 'Explorador de Recetas', 'descripcion': 'Visitaste 10 recetas diferentes', 'icono': '🍽️', 'puntos': 15},
    {'nombre': 'Quiz Master', 'descripcion': 'Completaste el quiz con más del 80%', 'icono': '🎓', 'puntos': 25},
    {'nombre': 'Favoritos', 'descripcion': 'Guardaste 5 recetas en favoritos', 'icono': '❤️', 'puntos': 20},
    {'nombre': 'Constancia', 'descripcion': 'Usaste la plataforma 7 días seguidos', 'icono': '🔥', 'puntos': 50},
    {'nombre': 'Experto en Nutrición', 'descripcion': 'Respondiste 5 quizzes correctamente', 'icono': '🥗', 'puntos': 40},
    {'nombre': 'Calculador Dedicado', 'descripcion': 'Realizaste 10 cálculos nutricionales', 'icono': '📊', 'puntos': 30},
    {'nombre': 'Aprendiz', 'descripcion': 'Leíste 5 artículos educativos', 'icono': '📚', 'puntos': 20},
    {'nombre': 'Chef Saludable', 'descripcion': 'Guardaste 10 recetas en favoritos', 'icono': '👨‍🍳', 'puntos': 35},
    {'nombre': 'Nivel Máximo', 'descripcion': 'Alcanzaste el nivel 10', 'icono': '⭐', 'puntos': 100},
]

def main():
    print("\n🏆 Creando logros del sistema...\n")
    creados = 0
    for data in LOGROS:
        logro, created = Logro.objects.get_or_create(nombre=data['nombre'], defaults=data)
        status = '✅ creado' if created else '⏭️  ya existía'
        print(f"  {data['icono']} {logro.nombre}: {status}")
        if created:
            creados += 1
    print(f"\n✅ Proceso completado. {creados} logros nuevos creados.")

if __name__ == '__main__':
    main()
