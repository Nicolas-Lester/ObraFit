"""
Script para poblar la base de datos con recetas chilenas saludables.
Uso: python scripts/poblar_db.py
"""
import os
import sys
import django

# Asegurarse de que el encoding sea UTF-8
os.environ['PYTHONIOENCODING'] = 'utf-8'
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.development')

# Añadir el directorio backend al path
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

django.setup()

from apps.recetas.models import CategoriaReceta, Receta

def crear_categorias():
    categorias_data = [
        {'nombre': 'Desayunos Energéticos', 'tipo_comida': 'desayuno', 'icono': 'fa-sun', 'color': 'yellow-500', 'descripcion': 'Desayunos nutritivos para empezar el día con energía'},
        {'nombre': 'Almuerzos Completos', 'tipo_comida': 'almuerzo', 'icono': 'fa-utensils', 'color': 'primary-500', 'descripcion': 'Almuerzos balanceados con proteínas y carbohidratos'},
        {'nombre': 'Cenas Livianas', 'tipo_comida': 'cena', 'icono': 'fa-moon', 'color': 'mint-500', 'descripcion': 'Cenas ligeras y nutritivas para la noche'},
        {'nombre': 'Colaciones Saludables', 'tipo_comida': 'snack', 'icono': 'fa-apple-alt', 'color': 'green-500', 'descripcion': 'Snacks saludables para mantener la energía'},
    ]
    categorias = {}
    for data in categorias_data:
        cat, created = CategoriaReceta.objects.get_or_create(
            nombre=data['nombre'],
            defaults=data
        )
        categorias[data['tipo_comida']] = cat
        status = 'creada' if created else 'ya existía'
        print(f"  Categoría '{cat.nombre}': {status}")
    return categorias


def crear_recetas_ejemplo(categorias):
    recetas_data = [
        {
            'nombre': 'Avena con Frutas y Miel',
            'descripcion_corta': 'Desayuno clásico chileno rico en fibra y energía',
            'descripcion': 'Una avena cremosa con frutas frescas de temporada y un toque de miel natural.',
            'categoria': categorias['desayuno'],
            'calorias': 320,
            'proteinas': 10.5,
            'carbohidratos': 58.0,
            'grasas': 6.5,
            'tiempo_preparacion': 10,
            'porciones': 1,
            'dificultad': 'facil',
            'costo_aproximado': 800,
            'ingredientes': '1 taza de avena\n2 tazas de leche o agua\n1 plátano\n1 manzana\n1 cucharada de miel\nCanela al gusto',
            'instrucciones': 'Hervir la leche\nAgregar la avena y cocinar 5 minutos revolviendo\nServir y agregar las frutas cortadas\nAgregar miel y canela al gusto',
            'es_popular': True,
        },
        {
            'nombre': 'Cazuela de Vacuno',
            'descripcion_corta': 'Plato tradicional chileno reconfortante y nutritivo',
            'descripcion': 'La cazuela de vacuno es uno de los platos más emblemáticos de la cocina chilena.',
            'categoria': categorias['almuerzo'],
            'calorias': 450,
            'proteinas': 35.0,
            'carbohidratos': 42.0,
            'grasas': 12.0,
            'tiempo_preparacion': 60,
            'porciones': 4,
            'dificultad': 'media',
            'costo_aproximado': 3500,
            'ingredientes': '500g de carne de vacuno (osobuco o plateada)\n2 papas medianas\n2 zanahorias\n1/2 zapallo\n2 choclos\n1 cebolla\nOrégano y sal al gusto',
            'instrucciones': 'Dorar la carne en una olla grande\nAgregar cebolla picada y sofreír\nCubrir con agua caliente y cocinar 30 min\nAgregar las verduras cortadas\nCocinar 20 min más hasta que todo esté tierno\nSazonar con sal y orégano',
            'es_popular': True,
        },
        {
            'nombre': 'Ensalada Chilena',
            'descripcion_corta': 'Ensalada fresca de tomate y cebolla, clásica de Chile',
            'descripcion': 'La ensalada chilena es un acompañamiento clásico, refrescante y saludable.',
            'categoria': categorias['cena'],
            'calorias': 85,
            'proteinas': 2.0,
            'carbohidratos': 12.0,
            'grasas': 3.5,
            'tiempo_preparacion': 10,
            'porciones': 2,
            'dificultad': 'facil',
            'costo_aproximado': 600,
            'ingredientes': '3 tomates maduros\n1 cebolla blanca\nCilantro fresco\n2 cucharadas de aceite de oliva\nJugo de 1 limón\nSal y pimienta',
            'instrucciones': 'Cortar los tomates en rodajas\nCortar la cebolla en pluma y remojar en agua fría 5 min\nMezclar tomates y cebolla escurrida\nAgregar cilantro picado\nAliñar con limón, aceite, sal y pimienta',
            'es_popular': True,
        },
        {
            'nombre': 'Yogur con Granola y Berries',
            'descripcion_corta': 'Colación saludable alta en probióticos y antioxidantes',
            'descripcion': 'Una combinación perfecta de yogur natural, granola crujiente y frutas del bosque.',
            'categoria': categorias['snack'],
            'calorias': 220,
            'proteinas': 8.0,
            'carbohidratos': 35.0,
            'grasas': 6.0,
            'tiempo_preparacion': 5,
            'porciones': 1,
            'dificultad': 'facil',
            'costo_aproximado': 1200,
            'ingredientes': '1 taza de yogur natural\n3 cucharadas de granola\n1/2 taza de berries (arándanos, frutillas)\n1 cucharadita de miel',
            'instrucciones': 'Servir el yogur en un bowl\nAgregar la granola\nAñadir los berries\nDrizzlear con miel',
            'es_popular': True,
        },
    ]

    for data in recetas_data:
        receta, created = Receta.objects.get_or_create(
            nombre=data['nombre'],
            defaults=data
        )
        status = 'creada' if created else 'ya existía'
        print(f"  Receta '{receta.nombre}': {status}")


if __name__ == '__main__':
    print("\n🍽️  Poblando base de datos con recetas chilenas...\n")
    print("📁 Creando categorías...")
    categorias = crear_categorias()
    print("\n🥘 Creando recetas de ejemplo...")
    crear_recetas_ejemplo(categorias)
    print(f"\n✅ ¡Listo! Ejecuta el script poblar_db_chile.py para cargar las 500+ recetas completas.")
