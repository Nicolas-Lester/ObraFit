# -*- coding: utf-8 -*-
"""
Pobla la base de datos con recetas chilenas para obreros.

Uso (desde la carpeta backend/):
    python manage.py shell < scripts/poblar_db_chile.py

O directamente:
    python scripts/poblar_db_chile.py
"""

import os
import sys
import django

if __name__ == '__main__':
    # Agregar backend/ al path para que encuentre config/
    sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings.development')
    django.setup()

from apps.recetas.models import CategoriaReceta, Receta, ContenidoEducativo, PreguntaQuiz
from apps.usuarios.models import Logro

print("🔄 Verificando base de datos...")
print(f"   - Categorías existentes: {CategoriaReceta.objects.count()}")
print(f"   - Recetas existentes: {Receta.objects.count()}")
print(f"   - Contenido educativo existente: {ContenidoEducativo.objects.count()}")
print(f"   - Preguntas existentes: {PreguntaQuiz.objects.count()}")
print(f"   - Logros existentes: {Logro.objects.count()}")

print("\n📁 Creando categorías...")

desayuno, _ = CategoriaReceta.objects.get_or_create(
    nombre="Desayunos Energéticos",
    defaults={
        'tipo_comida': "desayuno",
        'icono': "fa-egg",
        'color': "yellow-500",
        'descripcion': "Comienza el día con fuerza"
    }
)

almuerzo, _ = CategoriaReceta.objects.get_or_create(
    nombre="Almuerzos Completos",
    defaults={
        'tipo_comida': "almuerzo",
        'icono': "fa-hamburger",
        'color': "red-500",
        'descripcion': "Comida pa' aguantar la pega"
    }
)

cena, _ = CategoriaReceta.objects.get_or_create(
    nombre="Cenas Ligeras",
    defaults={
        'tipo_comida': "cena",
        'icono': "fa-pizza-slice",
        'color': "mint-500",
        'descripcion': "Termina el día bien alimentado"
    }
)

colacion, _ = CategoriaReceta.objects.get_or_create(
    nombre="Colaciones",
    defaults={
        'tipo_comida': "snack",
        'icono': "fa-cookie-bite",
        'color': "orange-500",
        'descripcion': "Pa' la once o entre comidas"
    }
)

# ── Desayunos ─────────────────────────────────────────────────────────────────
print("🍳 Creando desayunos chilenos...")

Receta.objects.get_or_create(
    nombre="Huevos Revueltos con Pan Amasado",
    defaults={
        'descripcion_corta': "Desayuno contundente para empezar la pega",
        'descripcion': "El clásico chileno que te deja listo para la jornada. Pan amasado casero con huevos revueltos, simple pero llenador.",
        'categoria': desayuno,
        'calorias': 420,
        'proteinas': 22,
        'carbohidratos': 48,
        'grasas': 16,
        'tiempo_preparacion': 15,
        'porciones': 2,
        'dificultad': "facil",
        'costo_aproximado': 1500.00,
        'ingredientes': "4 huevos\n2 panes amasados\n1 tomate\n1 cucharada de aceite\nSal y merkén al gusto\nPerejil picado",
        'instrucciones': "Pica el tomate en cubitos chicos\nCalienta el aceite en un sartén\nBate los huevos con sal\nEcha el tomate al sartén y cocina 2 minutos\nAgrega los huevos y revuelve hasta que cuajen\nCalienta el pan amasado en el horno o sartén\nSirve con merkén y perejil",
        'tips': "El pan amasado lo puedes comprar en la panadería de la esquina o hacerlo el domingo para toda la semana. Si sobra, lo guardas en el congelador.",
        'es_popular': True
    }
)

Receta.objects.get_or_create(
    nombre="Avena con Manzana y Miel",
    defaults={
        'descripcion_corta': "Energía que dura toda la mañana",
        'descripcion': "La avena es barata, rinde caleta y te mantiene con energía. Perfecta para llevar en termo.",
        'categoria': desayuno,
        'calorias': 380,
        'proteinas': 12,
        'carbohidratos': 62,
        'grasas': 8,
        'tiempo_preparacion': 10,
        'porciones': 2,
        'dificultad': "facil",
        'costo_aproximado': 1200.00,
        'ingredientes': "1 taza de avena\n3 tazas de leche o agua\n1 manzana\n2 cucharadas de miel\nCanela\nPasas (opcional)",
        'instrucciones': "Hierve la leche o agua\nEcha la avena y cocina 5 minutos revolviendo\nPica la manzana en cubitos\nAgrega la manzana y las pasas\nSirve con miel y canela encima\nSi llevas al trabajo, échala en un termo",
        'tips': "Puedes hacer harta avena el domingo y guardarla en la refri. En la mañana solo la calientas. También la puedes hacer con agua pa' ahorrar.",
        'es_popular': True
    }
)

Receta.objects.get_or_create(
    nombre="Completo del Obrero",
    defaults={
        'descripcion_corta': "El completo más nutritivo de Chile",
        'descripcion': "Versión saludable del completo chileno, con todo lo que necesitas para la pega.",
        'categoria': desayuno,
        'calorias': 480,
        'proteinas': 24,
        'carbohidratos': 52,
        'grasas': 18,
        'tiempo_preparacion': 12,
        'porciones': 2,
        'dificultad': "facil",
        'costo_aproximado': 2000.00,
        'ingredientes': "2 panes de completo\n2 vienesas de pavo\n1 palta\n2 tomates\nChucrut\nMostaza\nKetchup (opcional)",
        'instrucciones': "Hierve las vienesas 5 minutos\nCalienta los panes\nMachaca la palta en el pan\nPon la vienesa, tomate en rodajas y chucrut\nAgrega mostaza al gusto\nEnvuelve en papel aluminio pa' llevar",
        'tips': "La palta la puedes remojar con limón pa' que no se ponga negra. Si no hay chucrut, échale repollo rallado con vinagre y sal.",
        'es_popular': True
    }
)

# ── Almuerzos ─────────────────────────────────────────────────────────────────
print("🥘 Creando almuerzos contundentes...")

Receta.objects.get_or_create(
    nombre="Porotos con Rienda",
    defaults={
        'descripcion_corta': "El plato más completo y llenador",
        'descripcion': "Comida tradicional chilena que te da fuerza pa' toda la tarde. Barato, rico y nutritivo.",
        'categoria': almuerzo,
        'calorias': 620,
        'proteinas': 32,
        'carbohidratos': 78,
        'grasas': 18,
        'tiempo_preparacion': 40,
        'porciones': 4,
        'dificultad': "media",
        'costo_aproximado': 4000.00,
        'ingredientes': "500g porotos\n200g longaniza\n2 zapallitos italianos\n1 cebolla\n2 tomates\nAjí de color\nComino, orégano, merkén\nSal y aceite",
        'instrucciones': "Deja los porotos en remojo desde la noche anterior\nCuece los porotos con agua y sal por 30 minutos\nPica la cebolla, tomate y zapallitos\nFríe la longaniza cortada en rodajas\nSofríe la cebolla, agrega tomate y condimentos\nEcha los zapallitos y cocina 5 minutos\nMezcla todo con los porotos cocidos\nSirve bien caliente",
        'tips': "Puedes cocinar harto y congelarlo en porciones. Los porotos de tarro también sirven si no tienes tiempo. Lo llevas en tupper al trabajo.",
        'es_popular': True
    }
)

Receta.objects.get_or_create(
    nombre="Bistec a lo Pobre",
    defaults={
        'descripcion_corta': "El almuerzo que te deja listo pa' la pega",
        'descripcion': "Versión económica del clásico chileno. Proteína, carbohidratos y todo lo que necesitas.",
        'categoria': almuerzo,
        'calorias': 680,
        'proteinas': 42,
        'carbohidratos': 68,
        'grasas': 24,
        'tiempo_preparacion': 25,
        'porciones': 2,
        'dificultad': "media",
        'costo_aproximado': 5000.00,
        'ingredientes': "2 bistecs de posta rosada\n2 papas grandes\n2 huevos\n1 cebolla\nArroz cocido (2 tazas)\nAceite, sal y pimienta",
        'instrucciones': "Pela y corta las papas en bastones gruesos\nFríe las papas hasta dorarlas\nSazona los bistecs con sal y pimienta\nFríe los bistecs 3 minutos por lado\nCorta la cebolla en pluma y sofríela\nFríe los huevos\nSirve el bistec con papas fritas, arroz, huevo y cebolla",
        'tips': "Puedes usar papas en gajos al horno pa' hacerlo más sano. El arroz lo haces el día anterior. Si quieres ahorrar, reemplaza el bistec por pechuga de pollo.",
        'es_popular': True
    }
)

Receta.objects.get_or_create(
    nombre="Cazuela de Pollo",
    defaults={
        'descripcion_corta': "Sopa contundente pa' recuperar fuerzas",
        'descripcion': "La cazuela chilena clásica con todo. Te llena, te calienta y te nutre.",
        'categoria': almuerzo,
        'calorias': 480,
        'proteinas': 36,
        'carbohidratos': 58,
        'grasas': 12,
        'tiempo_preparacion': 50,
        'porciones': 4,
        'dificultad': "media",
        'costo_aproximado': 6000.00,
        'ingredientes': "4 presas de pollo\n2 papas\n2 zanahorias\n1 zapallo\n1/2 repollo\n1 choclo\nArroz\nAjí de color\nCilantro, orégano\nSal",
        'instrucciones': "Hierve el pollo con sal por 20 minutos\nPela y corta las verduras en trozos grandes\nAgrega las papas y zanahorias\nDespués de 10 minutos, echa el zapallo y choclo\nAgrega el repollo y arroz\nCocina 15 minutos más\nSirve bien caliente con cilantro picado",
        'tips': "Rinde caleta y puedes congelarla. Si no tienes choclo fresco, usa choclo en tarro. Perfecta para los días fríos en la obra.",
        'es_popular': True
    }
)

Receta.objects.get_or_create(
    nombre="Charquicán",
    defaults={
        'descripcion_corta': "Plato completo y económico",
        'descripcion': "Comida tradicional chilena que aprovecha todo. Nutritiva y llenadora.",
        'categoria': almuerzo,
        'calorias': 520,
        'proteinas': 28,
        'carbohidratos': 62,
        'grasas': 18,
        'tiempo_preparacion': 35,
        'porciones': 4,
        'dificultad': "facil",
        'costo_aproximado': 4500.00,
        'ingredientes': "500g carne molida\n4 papas\n2 zanahorias\n1 zapallo\n1 cebolla\n2 dientes de ajo\nComino, orégano, merkén\nSal y aceite",
        'instrucciones': "Pica la cebolla y ajo, sofríelos\nAgrega la carne molida y dora\nPela y corta las papas, zapallo y zanahoria en cubos\nEcha las verduras a la olla con la carne\nAgrega agua hasta cubrir, sal y condimentos\nCocina 25 minutos hasta que las papas estén blandas\nMachaca un poco con un tenedor\nSirve caliente",
        'tips': "Puedes hacerlo sin carne pa' ahorrar, queda igual de rico. También puedes usar sobras de carne asada. Lo guardas en la refri toda la semana.",
        'es_popular': True
    }
)

# ── Cenas ─────────────────────────────────────────────────────────────────────
print("🌙 Creando cenas ligeras...")

Receta.objects.get_or_create(
    nombre="Pantrucas Caseras",
    defaults={
        'descripcion_corta': "Sopa reconfortante pa' la noche",
        'descripcion': "Cena liviana pero satisfactoria. Perfecta pa' los días fríos.",
        'categoria': cena,
        'calorias': 380,
        'proteinas': 18,
        'carbohidratos': 52,
        'grasas': 12,
        'tiempo_preparacion': 30,
        'porciones': 4,
        'dificultad': "media",
        'costo_aproximado': 3000.00,
        'ingredientes': "2 tazas de harina\n1 huevo\n1 pechuga de pollo\n2 papas\n1 zanahoria\n1 cebolla\nCaldo de pollo\nAjí de color\nSal y orégano",
        'instrucciones': "Mezcla harina, huevo, sal y agua pa' hacer la masa\nAmasa y estira fino, corta en cuadrados\nHierve el pollo con sal\nSaca el pollo y desmenuza\nEn el mismo caldo, echa las papas y zanahoria\nAgrega la cebolla picada y condimentos\nCuando hierva, echa las pantrucas de a poco\nCocina 10 minutos\nSirve con el pollo desmenuzado",
        'tips': "La masa la puedes hacer con anticipación. Si no tienes tiempo, compra fideos y queda parecido. El caldo lo puedes hacer con cubitos.",
        'es_popular': True
    }
)

Receta.objects.get_or_create(
    nombre="Tortilla de Verduras",
    defaults={
        'descripcion_corta': "Cena rápida y nutritiva",
        'descripcion': "Aprovecha las verduras que tengas. Rico, fácil y económico.",
        'categoria': cena,
        'calorias': 320,
        'proteinas': 20,
        'carbohidratos': 28,
        'grasas': 14,
        'tiempo_preparacion': 20,
        'porciones': 2,
        'dificultad': "facil",
        'costo_aproximado': 2500.00,
        'ingredientes': "4 huevos\n1 papa cocida\n1 zanahoria\n1/2 cebolla\nChoclo (opcional)\nQueso rallado\nSal, pimienta, merkén\nAceite",
        'instrucciones': "Pica todas las verduras en cubitos chicos\nSofríe las verduras en aceite\nBate los huevos con sal\nEcha los huevos sobre las verduras\nAgrega el queso arriba\nCocina a fuego bajo tapado 8 minutos\nDale vuelta con un plato\nSirve con pan o ensalada",
        'tips': "Puedes usar cualquier verdura que tengas. Es perfecta pa' aprovechar sobras. La llevas fría al trabajo al otro día pa' la colación.",
        'es_popular': False
    }
)

Receta.objects.get_or_create(
    nombre="Ensalada Chilena con Atún",
    defaults={
        'descripcion_corta': "Cena fresca y proteica",
        'descripcion': "Perfecta pa' los días de calor. El atún te da la proteína que necesitas.",
        'categoria': cena,
        'calorias': 340,
        'proteinas': 32,
        'carbohidratos': 38,
        'grasas': 8,
        'tiempo_preparacion': 15,
        'porciones': 2,
        'dificultad': "facil",
        'costo_aproximado': 3000.00,
        'ingredientes': "2 latas de atún en agua\n3 tomates\n1 cebolla morada\nCilantro picado\nLimón\nAceite de oliva\nSal\nPan (opcional)",
        'instrucciones': "Corta los tomates en rodajas\nPica la cebolla en pluma fina\nMezcla tomate y cebolla con sal\nAgrega cilantro picado\nAliña con limón y aceite\nEscurre el atún y ponlo encima\nSirve con pan marraqueta",
        'tips': "Deja la cebolla en agua con limón 10 minutos pa' que no pique tanto. Puedes agregar palta pa' más sabor y nutrientes.",
        'es_popular': False
    }
)

# ── Colaciones ────────────────────────────────────────────────────────────────
print("🥤 Creando colaciones...")

Receta.objects.get_or_create(
    nombre="Plátano con Maní",
    defaults={
        'descripcion_corta': "Colación rápida pa' la obra",
        'descripcion': "Energía instantánea. Lo llevas en tu bolso.",
        'categoria': colacion,
        'calorias': 280,
        'proteinas': 8,
        'carbohidratos': 42,
        'grasas': 10,
        'tiempo_preparacion': 2,
        'porciones': 1,
        'dificultad': "facil",
        'costo_aproximado': 800.00,
        'ingredientes': "1 plátano\n2 cucharadas de mantequilla de maní\nGranola (opcional)",
        'instrucciones': "Pela el plátano\nUnta con mantequilla de maní\nSi quieres, espolvorea granola\n¡Listo pa' comer!",
        'tips': "Perfecto pa' la media mañana en la obra. El plátano te da energía rápida y el maní te mantiene satisfecho.",
        'es_popular': True
    }
)

Receta.objects.get_or_create(
    nombre="Yogurt con Frutas y Avena",
    defaults={
        'descripcion_corta': "Colación nutritiva pa' la once",
        'descripcion': "Proteína y energía en un vasito. Fácil de llevar.",
        'categoria': colacion,
        'calorias': 300,
        'proteinas': 14,
        'carbohidratos': 48,
        'grasas': 6,
        'tiempo_preparacion': 5,
        'porciones': 1,
        'dificultad': "facil",
        'costo_aproximado': 1500.00,
        'ingredientes': "1 yogurt natural\n1/2 taza de avena\n1 manzana o plátano\n1 cucharada de miel\nCanela",
        'instrucciones': "Pon el yogurt en un vaso o tupper\nEcha la avena encima\nPica la fruta y agrégala\nRocía miel y canela\nMézcla todo",
        'tips': "Lo puedes preparar en la noche y llevarlo en un cooler al trabajo. Usa frascos con tapa pa' que no se derrame.",
        'es_popular': True
    }
)

Receta.objects.get_or_create(
    nombre="Mote con Huesillos (Versión Casera)",
    defaults={
        'descripcion_corta': "Refresco chileno tradicional y energético",
        'descripcion': "Perfecto pa' el calor. Dulce natural y nutritivo.",
        'categoria': colacion,
        'calorias': 220,
        'proteinas': 4,
        'carbohidratos': 52,
        'grasas': 1,
        'tiempo_preparacion': 60,
        'porciones': 4,
        'dificultad': "media",
        'costo_aproximado': 2500.00,
        'ingredientes': "1 taza de mote\n200g huesillos\nAzúcar al gusto\nCanela\nCáscara de naranja\nAgua",
        'instrucciones': "Remoja el mote desde la noche anterior\nCuece el mote hasta que esté blando\nHierve los huesillos con azúcar, canela y cáscara de naranja\nMezcla el mote con el jugo de huesillos\nDeja enfriar en la refri\nSirve bien helado en un vaso grande",
        'tips': "Haces harta cantidad el fin de semana y dura toda la semana. Más sano que las bebidas, y te da energía. Lo llevas en botella al trabajo.",
        'es_popular': True
    }
)

# ── Contenido educativo ───────────────────────────────────────────────────────
print("📚 Creando contenido educativo...")

ContenidoEducativo.objects.get_or_create(
    titulo="Alimentación del Obrero Chileno",
    defaults={
        'descripcion': "Por qué necesitas comer bien si trabajas en la construcción",
        'tipo': "articulo",
        'contenido': (
            "Trabajar en la construcción es de lo más pesado que hay. Tu cuerpo necesita combustible de calidad pa' aguantar.\n\n"
            "Por qué es importante:\n"
            "- Evitas lesiones y accidentes por mareos o fatiga\n"
            "- Rindes más en la pega\n"
            "- No te enfermas tanto\n"
            "- Llegas a la casa con energía pa' tu familia\n\n"
            "Lo que necesitas todos los días:\n"
            "- Proteínas: Carne, pollo, huevos, porotos, lentejas\n"
            "- Carbohidratos: Pan, arroz, papas, fideos (pa' la energía)\n"
            "- Verduras: Aunque sea tomate y cebolla en las comidas\n"
            "- Agua: Mucha, mucha agua\n\n"
            "El desayuno es sagrado: No salgas a la pega sin desayunar. Un desayuno completo te mantiene hasta el almuerzo.\n\n"
            "Consejo de maestro: Prepara tu comida el domingo. Cocina harto y congela en porciones. Sale más barato y comes mejor."
        ),
        'icono': "fa-hard-hat",
        'color': "orange-500",
        'duracion_lectura': 6,
        'es_destacado': True,
        'orden': 1
    }
)

ContenidoEducativo.objects.get_or_create(
    titulo="Toma Agua, No Bebidas",
    defaults={
        'descripcion': "La deshidratación es peligrosa en la obra",
        'tipo': "articulo",
        'contenido': (
            "En la obra, el calor y el esfuerzo te deshidratan rápido. La deshidratación es peligrosa y puede causarte problemas serios.\n\n"
            "Señales de que necesitas agua:\n"
            "- Tienes sed (si tienes sed, ya estás deshidratado)\n"
            "- Dolor de cabeza\n"
            "- Mareos\n"
            "- Cansancio extremo\n\n"
            "Cuánta agua necesitas: Mínimo 8 vasos al día, pero si estás en la obra con calor, necesitas mucha más. Toma cada 15-20 minutos.\n\n"
            "Ojo con esto: Si te sientes muy mareado, para de trabajar inmediatamente. Busca sombra y toma agua. Es mejor parar 15 minutos que terminar en el hospital."
        ),
        'icono': "fa-tint",
        'color': "blue-500",
        'duracion_lectura': 5,
        'es_destacado': True,
        'orden': 2
    }
)

ContenidoEducativo.objects.get_or_create(
    titulo="Proteínas Pa' Mantenerte Fuerte",
    defaults={
        'descripcion': "Por qué la carne, huevos y porotos son importantes",
        'tipo': "articulo",
        'contenido': (
            "Si trabajas con el cuerpo, necesitas proteína. La proteína repara tus músculos y te mantiene fuerte.\n\n"
            "Fuentes de proteína baratas:\n"
            "- Huevos (lo más barato y completo)\n"
            "- Porotos y lentejas (rinden caleta)\n"
            "- Pollo (más barato que carne)\n"
            "- Atún en lata\n"
            "- Leche y yogurt\n\n"
            "Cuánto necesitas: Si pesas 80 kilos, necesitas unos 120g de proteína al día.\n\n"
            "Pa' ahorrar: Compra el huevo por maple, el pollo entero y los porotos secos. Sale mucho más barato que comprar comida preparada."
        ),
        'icono': "fa-drumstick-bite",
        'color': "red-500",
        'duracion_lectura': 5,
        'es_destacado': False,
        'orden': 3
    }
)

# Tips rápidos
tips = [
    ("Lleva colación a la obra", "Un plátano con maní te da energía pa' toda la tarde", "No compres dulces ni bebidas. Lleva fruta y frutos secos, más baratos y más sanos.", "fa-apple-alt", "green-500", 10),
    ("Cocina los domingos", "Prepara toda tu comida de la semana el domingo", "Haces harta comida, la divides en tuppers y congelas. Sales más barato y comes mejor que comprando afuera.", "fa-calendar", "purple-500", 11),
    ("Evita las bebidas", "La bebida y el jugo son puro azúcar", "Toma agua o mote con huesillos casero. Las bebidas te dan energía por 10 minutos y después te dejan más cansado.", "fa-ban", "red-500", 12),
    ("Duerme bien", "Necesitas 7-8 horas pa' recuperarte", "Si no duermes, te vas a lesionar. Tu cuerpo se repara mientras duermes. No es flojera, es necesidad.", "fa-bed", "indigo-500", 13),
    ("Pan amasado mejor que marraqueta", "El pan amasado tiene más calorías y te mantiene con energía", "Si trabajas pesado, necesitas las calorías del pan amasado. No es malo, tu cuerpo lo necesita.", "fa-bread-slice", "yellow-500", 14),
]

for titulo, desc, contenido, icono, color, orden in tips:
    ContenidoEducativo.objects.get_or_create(
        titulo=titulo,
        defaults={
            'descripcion': desc,
            'tipo': "tip",
            'contenido': contenido,
            'icono': icono,
            'color': color,
            'duracion_lectura': 1,
            'orden': orden
        }
    )

# ── Preguntas del quiz ─────────────────────────────────────────────────────────
print("❓ Creando preguntas del quiz...")

preguntas = [
    ("¿Cuál es la comida más importante del día pa' un obrero?", "La once", "El desayuno", "El almuerzo", "Da lo mismo", "b", "El desayuno te da la energía pa' empezar la pega. Sin desayuno vas a andar mareado y sin fuerza toda la mañana.", "Nutrición Básica", 1),
    ("¿Cuánta agua debes tomar en la obra?", "Solo cuando tengas sed", "2-3 vasos al día", "8 vasos o más, mucho más si hace calor", "Las bebidas cuentan igual", "c", "En la obra necesitas mucha agua, especialmente con calor. Toma cada 15-20 minutos, no esperes a tener sed.", "Hidratación", 1),
    ("¿Qué nutriente repara tus músculos después de la pega?", "El azúcar", "La proteína", "La grasa", "Las bebidas", "b", "La proteína (de la carne, huevos, porotos) es la que repara tus músculos. Por eso necesitas comer proteína todos los días.", "Nutrición Básica", 1),
    ("¿Cuál es la fuente de proteína más barata?", "Bebidas proteicas caras", "Carne importada", "Huevos y porotos", "Suplementos de gimnasio", "c", "Los huevos y porotos son lo más barato y completo. Un maple de huevos y un kilo de porotos te duran toda la semana.", "Economía", 1),
    ("Si te mareas y tienes mucha sed en la obra, ¿qué haces?", "Sigues trabajando no más", "Tomas una bebida", "Paras, buscas sombra y tomas agua", "Te aguantas hasta el almuerzo", "c", "Los mareos con sed son señal de deshidratación. Es peligroso, tienes que parar inmediatamente.", "Seguridad", 2),
    ("¿Qué es mejor pa' tener energía toda la mañana?", "Bebidas y dulces", "Solo café", "Desayuno con huevos, pan y fruta", "No desayunar pa' ahorrar tiempo", "c", "Un desayuno completo te da energía que dura. Los dulces y bebidas te dan energía por 10 minutos nomás.", "Energía", 2),
    ("¿Por qué los porotos son buenos pa' los obreros?", "Solo porque son baratos", "Tienen proteína, fibra y hierro", "No sirven pa' nada", "Solo pa' llenar la guata", "b", "Los porotos son un superalimento: tienen proteína, fibra y hierro. Además son re baratos.", "Nutrición", 2),
    ("¿Cuánto debes dormir pa' recuperarte de la pega?", "4-5 horas, hay que trabajar", "Lo que se pueda", "7-8 horas", "No importa", "c", "Necesitas 7-8 horas pa' que tu cuerpo se recupere. Si no duermes, te vas a lesionar y vas a rendir menos.", "Descanso", 1),
    ("¿Qué es mejor llevar de colación a la obra?", "Bebidas y papas fritas", "Plátano con maní", "Puras galletas", "Dulces", "b", "El plátano te da energía rápida y el maní tiene proteína pa' que te dure. Es más barato que los dulces y mucho más sano.", "Colaciones", 1),
    ("¿Cómo puedes ahorrar en comida siendo obrero?", "No comer tanto", "Cocinar harto el domingo y congelar", "Comprar comida preparada todos los días", "Solo comer pan", "b", "Si cocinas harto el domingo y congelas, comes mejor y más barato. Un kilo de porotos te da pa' toda la semana.", "Economía", 2),
]

for p in preguntas:
    PreguntaQuiz.objects.get_or_create(
        pregunta=p[0],
        defaults={
            'opcion_a': p[1], 'opcion_b': p[2], 'opcion_c': p[3], 'opcion_d': p[4],
            'respuesta_correcta': p[5], 'explicacion': p[6],
        }
    )

# ── Logros ────────────────────────────────────────────────────────────────────
print("🏆 Creando logros...")

logros = [
    ("Primera Receta", "Preparaste tu primera receta", "fa-utensils", "primary-500", "primera_receta", 10),
    ("Chef de Obra", "Preparaste 5 recetas diferentes", "fa-hard-hat", "orange-500", "cinco_recetas", 25),
    ("Maestro Cocinero", "Preparaste 10 recetas diferentes", "fa-award", "yellow-500", "diez_recetas", 50),
    ("Estudiante Aplicado", "Completaste tu primer quiz", "fa-graduation-cap", "blue-500", "primer_quiz", 15),
    ("Puntaje Perfecto", "Sacaste 100% en un quiz", "fa-star", "yellow-500", "quiz_perfecto", 50),
    ("Una Semana Constante", "Mantuviste una racha de 7 días", "fa-fire", "red-500", "racha_7", 40),
]

for nombre, desc, icono, color, condicion, puntos in logros:
    Logro.objects.get_or_create(
        nombre=nombre,
        defaults={
            'descripcion': desc, 'icono': icono, 'color': color,
            'condicion': condicion, 'puntos': puntos
        }
    )

print("\n✅ ¡Base de datos poblada con recetas chilenas pa' obreros!")
print(f"📊 Estadísticas finales:")
print(f"   - Categorías: {CategoriaReceta.objects.count()}")
print(f"   - Recetas: {Receta.objects.count()}")
print(f"   - Contenido Educativo: {ContenidoEducativo.objects.count()}")
print(f"   - Preguntas Quiz: {PreguntaQuiz.objects.count()}")
print(f"   - Logros: {Logro.objects.count()}")
