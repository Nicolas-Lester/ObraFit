# -*- coding: utf-8 -*-
# Script para poblar la base de datos con recetas chilenas para obreros
# Ejecutar con: Get-Content poblar_db_chile.py | python manage.py shell

from recetas.models import CategoriaReceta, Receta, ContenidoEducativo, PreguntaQuiz, Logro

print("🔄 Verificando base de datos...")
print(f"   - Categorías existentes: {CategoriaReceta.objects.count()}")
print(f"   - Recetas existentes: {Receta.objects.count()}")
print(f"   - Contenido educativo existente: {ContenidoEducativo.objects.count()}")
print(f"   - Preguntas existentes: {PreguntaQuiz.objects.count()}")
print(f"   - Logros existentes: {Logro.objects.count()}")

print("\n📁 Creando categorías...")

desayuno, created = CategoriaReceta.objects.get_or_create(
    nombre="Desayunos Energéticos",
    defaults={
        'tipo_comida': "desayuno",
        'icono': "fa-egg",
        'color': "yellow-500",
        'descripcion': "Comienza el día con fuerza"
    }
)

almuerzo, created = CategoriaReceta.objects.get_or_create(
    nombre="Almuerzos Completos",
    defaults={
        'tipo_comida': "almuerzo",
        'icono': "fa-hamburger",
        'color': "red-500",
        'descripcion': "Comida pa' aguantar la pega"
    }
)

cena, created = CategoriaReceta.objects.get_or_create(
    nombre="Cenas Ligeras",
    defaults={
        'tipo_comida': "cena",
        'icono': "fa-pizza-slice",
        'color': "mint-500",
        'descripcion': "Termina el día bien alimentado"
    }
)

colacion, created = CategoriaReceta.objects.get_or_create(
    nombre="Colaciones",
    defaults={
        'tipo_comida': "snack",
        'icono': "fa-cookie-bite",
        'color': "orange-500",
        'descripcion': "Pa' la once o entre comidas"
    }
)

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
        'ingredientes': """4 huevos
2 panes amasados
1 tomate
1 cucharada de aceite
Sal y merkén al gusto
Perejil picado""",
        'instrucciones': """Pica el tomate en cubitos chicos
Calienta el aceite en un sartén
Bate los huevos con sal
Echa el tomate al sartén y cocina 2 minutos
Agrega los huevos y revuelve hasta que cuajen
Calienta el pan amasado en el horno o sartén
Sirve con merkén y perejil""",
        'tips': "El pan amasado lo puedes comprar en la panadería de la esquina o hacerlo el domingo para toda la semana. Si sobra, lo guardas en el congelador.",
        'es_popular': True
    }
)

Receta.objects.create(
    nombre="Avena con Manzana y Miel",
    descripcion_corta="Energía que dura toda la mañana",
    descripcion="La avena es barata, rinde caleta y te mantiene con energía. Perfecta para llevar en termo.",
    categoria=desayuno,
    calorias=380,
    proteinas=12,
    carbohidratos=62,
    grasas=8,
    tiempo_preparacion=10,
    porciones=2,
    dificultad="facil",
    costo_aproximado=1200.00,
    ingredientes="""1 taza de avena
3 tazas de leche o agua
1 manzana
2 cucharadas de miel
Canela
Pasas (opcional)""",
    instrucciones="""Hierve la leche o agua
Echa la avena y cocina 5 minutos revolviendo
Pica la manzana en cubitos
Agrega la manzana y las pasas
Sirve con miel y canela encima
Si llevas al trabajo, échala en un termo""",
    tips="Puedes hacer harta avena el domingo y guardarla en la refri. En la mañana solo la calientas. También la puedes hacer con agua pa' ahorrar.",
    es_popular=True
)

Receta.objects.create(
    nombre="Completo del Obrero",
    descripcion_corta="El completo más nutritivo de Chile",
    descripcion="Versión saludable del completo chileno, con todo lo que necesitas para la pega.",
    categoria=desayuno,
    calorias=480,
    proteinas=24,
    carbohidratos=52,
    grasas=18,
    tiempo_preparacion=12,
    porciones=2,
    dificultad="facil",
    costo_aproximado=2000.00,
    ingredientes="""2 panes de completo
2 vienesas de pavo
1 palta
2 tomates
Chucrut
Mostaza
Ketchup (opcional)""",
    instrucciones="""Hierve las vienesas 5 minutos
Calienta los panes
Machaca la palta en el pan
Pon la vienesa, tomate en rodajas y chucrut
Agrega mostaza al gusto
Envuelve en papel aluminio pa' llevar""",
    tips="La palta la puedes remojar con limón pa' que no se ponga negra. Si no hay chucrut, échale repollo rallado con vinagre y sal.",
    es_popular=True
)

print("🥘 Creando almuerzos contundentes...")

Receta.objects.create(
    nombre="Porotos con Rienda",
    descripcion_corta="El plato más completo y llenador",
    descripcion="Comida tradicional chilena que te da fuerza pa' toda la tarde. Barato, rico y nutritivo.",
    categoria=almuerzo,
    calorias=620,
    proteinas=32,
    carbohidratos=78,
    grasas=18,
    tiempo_preparacion=40,
    porciones=4,
    dificultad="media",
    costo_aproximado=4000.00,
    ingredientes="""500g porotos
200g longaniza
2 zapallitos italianos
1 cebolla
2 tomates
Ají de color
Comino, orégano, merkén
Sal y aceite""",
    instrucciones="""Deja los porotos en remojo desde la noche anterior
Cuece los porotos con agua y sal por 30 minutos
Pica la cebolla, tomate y zapallitos
Fríe la longaniza cortada en rodajas
Sofríe la cebolla, agrega tomate y condimentos
Echa los zapallitos y cocina 5 minutos
Mezcla todo con los porotos cocidos
Sirve bien caliente""",
    tips="Puedes cocinar harto y congelarlo en porciones. Los porotos de tarro también sirven si no tienes tiempo. Lo llevas en tupper al trabajo.",
    es_popular=True
)

Receta.objects.create(
    nombre="Bistec a lo Pobre",
    descripcion_corta="El almuerzo que te deja listo pa' la pega",
    descripcion="Versión económica del clásico chileno. Proteína, carbohidratos y todo lo que necesitas.",
    categoria=almuerzo,
    calorias=680,
    proteinas=42,
    carbohidratos=68,
    grasas=24,
    tiempo_preparacion=25,
    porciones=2,
    dificultad="media",
    costo_aproximado=5000.00,
    ingredientes="""2 bistecs de posta rosada
2 papas grandes
2 huevos
1 cebolla
Arroz cocido (2 tazas)
Aceite, sal y pimienta""",
    instrucciones="""Pela y corta las papas en bastones gruesos
Fríe las papas hasta dorarlas
Sazona los bistecs con sal y pimienta
Fríe los bistecs 3 minutos por lado
Corta la cebolla en pluma y sofríela
Fríe los huevos
Sirve el bistec con papas fritas, arroz, huevo y cebolla""",
    tips="Puedes usar papas en gajos al horno pa' hacerlo más sano. El arroz lo haces el día anterior. Si quieres ahorrar, reemplaza el bistec por pechuga de pollo.",
    es_popular=True
)

Receta.objects.create(
    nombre="Cazuela de Pollo",
    descripcion_corta="Sopa contundente pa' recuperar fuerzas",
    descripcion="La cazuela chilena clásica con todo. Te llena, te calienta y te nutre.",
    categoria=almuerzo,
    calorias=480,
    proteinas=36,
    carbohidratos=58,
    grasas=12,
    tiempo_preparacion=50,
    porciones=4,
    dificultad="media",
    costo_aproximado=6000.00,
    ingredientes="""4 presas de pollo
2 papas
2 zanahorias
1 zapallo
1/2 repollo
1 choclo
Arroz
Ají de color
Cilantro, orégano
Sal""",
    instrucciones="""Hierve el pollo con sal por 20 minutos
Pela y corta las verduras en trozos grandes
Agrega las papas y zanahorias
Después de 10 minutos, echa el zapallo y choclo
Agrega el repollo y arroz
Cocina 15 minutos más
Sirve bien caliente con cilantro picado""",
    tips="Rinde caleta y puedes congelarla. Si no tienes choclo fresco, usa choclo en tarro. Perfecta para los días fríos en la obra.",
    es_popular=True
)

Receta.objects.create(
    nombre="Charquicán",
    descripcion_corta="Plato completo y económico",
    descripcion="Comida tradicional chilena que aprovecha todo. Nutritiva y llenadora.",
    categoria=almuerzo,
    calorias=520,
    proteinas=28,
    carbohidratos=62,
    grasas=18,
    tiempo_preparacion=35,
    porciones=4,
    dificultad="facil",
    costo_aproximado=4500.00,
    ingredientes="""500g carne molida
4 papas
2 zanahorias
1 zapallo
1 cebolla
2 dientes de ajo
Comino, orégano, merkén
Sal y aceite""",
    instrucciones="""Pica la cebolla y ajo, sofríelos
Agrega la carne molida y dora
Pela y corta las papas, zapallo y zanahoria en cubos
Echa las verduras a la olla con la carne
Agrega agua hasta cubrir, sal y condimentos
Cocina 25 minutos hasta que las papas estén blandas
Machaca un poco con un tenedor
Sirve caliente""",
    tips="Puedes hacerlo sin carne pa' ahorrar, queda igual de rico. También puedes usar sobras de carne asada. Lo guardas en la refri toda la semana.",
    es_popular=True
)

print("🌙 Creando cenas ligeras...")

Receta.objects.create(
    nombre="Pantrucas Caseras",
    descripcion_corta="Sopa reconfortante pa' la noche",
    descripcion="Cena liviana pero satisfactoria. Perfecta pa' los días fríos.",
    categoria=cena,
    calorias=380,
    proteinas=18,
    carbohidratos=52,
    grasas=12,
    tiempo_preparacion=30,
    porciones=4,
    dificultad="media",
    costo_aproximado=3000.00,
    ingredientes="""2 tazas de harina
1 huevo
1 pechuga de pollo
2 papas
1 zanahoria
1 cebolla
Caldo de pollo
Ají de color
Sal y orégano""",
    instrucciones="""Mezcla harina, huevo, sal y agua pa' hacer la masa
Amasa y estira fino, corta en cuadrados
Hierve el pollo con sal
Saca el pollo y desmenuza
En el mismo caldo, echa las papas y zanahoria
Agrega la cebolla picada y condimentos
Cuando hierva, echa las pantrucas de a poco
Cocina 10 minutos
Sirve con el pollo desmenuzado""",
    tips="La masa la puedes hacer con anticipación. Si no tienes tiempo, compra fideos y queda parecido. El caldo lo puedes hacer con cubitos.",
    es_popular=True
)

Receta.objects.create(
    nombre="Tortilla de Verduras",
    descripcion_corta="Cena rápida y nutritiva",
    descripcion="Aprovecha las verduras que tengas. Rico, fácil y económico.",
    categoria=cena,
    calorias=320,
    proteinas=20,
    carbohidratos=28,
    grasas=14,
    tiempo_preparacion=20,
    porciones=2,
    dificultad="facil",
    costo_aproximado=2500.00,
    ingredientes="""4 huevos
1 papa cocida
1 zanahoria
1/2 cebolla
Choclo (opcional)
Queso rallado
Sal, pimienta, merkén
Aceite""",
    instrucciones="""Pica todas las verduras en cubitos chicos
Sofríe las verduras en aceite
Bate los huevos con sal
Echa los huevos sobre las verduras
Agrega el queso arriba
Cocina a fuego bajo tapado 8 minutos
Dale vuelta con un plato
Sirve con pan o ensalada""",
    tips="Puedes usar cualquier verdura que tengas. Es perfecta pa' aprovechar sobras. La llevas fría al trabajo al otro día pa' la colación.",
    es_popular=False
)

Receta.objects.create(
    nombre="Ensalada Chilena con Atún",
    descripcion_corta="Cena fresca y proteica",
    descripcion="Perfecta pa' los días de calor. El atún te da la proteína que necesitas.",
    categoria=cena,
    calorias=340,
    proteinas=32,
    carbohidratos=38,
    grasas=8,
    tiempo_preparacion=15,
    porciones=2,
    dificultad="facil",
    costo_aproximado=3000.00,
    ingredientes="""2 latas de atún en agua
3 tomates
1 cebolla morada
Cilantro picado
Limón
Aceite de oliva
Sal
Pan (opcional)""",
    instrucciones="""Corta los tomates en rodajas
Pica la cebolla en pluma fina
Mezcla tomate y cebolla con sal
Agrega cilantro picado
Aliña con limón y aceite
Escurre el atún y ponlo encima
Sirve con pan marraqueta""",
    tips="Deja la cebolla en agua con limón 10 minutos pa' que no pique tanto. Puedes agregar palta pa' más sabor y nutrientes.",
    es_popular=False
)

print("🥤 Creando colaciones...")

Receta.objects.create(
    nombre="Plátano con Maní",
    descripcion_corta="Colación rápida pa' la obra",
    descripcion="Energía instantánea. Lo llevas en tu bolso.",
    categoria=colacion,
    calorias=280,
    proteinas=8,
    carbohidratos=42,
    grasas=10,
    tiempo_preparacion=2,
    porciones=1,
    dificultad="facil",
    costo_aproximado=800.00,
    ingredientes="""1 plátano
2 cucharadas de mantequilla de maní
Granola (opcional)""",
    instrucciones="""Pela el plátano
Unta con mantequilla de maní
Si quieres, espolvorea granola
¡Listo pa' comer!""",
    tips="Perfecto pa' la media mañana en la obra. El plátano te da energía rápida y el maní te mantiene satisfecho.",
    es_popular=True
)

Receta.objects.create(
    nombre="Yogurt con Frutas y Avena",
    descripcion_corta="Colación nutritiva pa' la once",
    descripcion="Proteína y energía en un vasito. Fácil de llevar.",
    categoria=colacion,
    calorias=300,
    proteinas=14,
    carbohidratos=48,
    grasas=6,
    tiempo_preparacion=5,
    porciones=1,
    dificultad="facil",
    costo_aproximado=1500.00,
    ingredientes="""1 yogurt natural
1/2 taza de avena
1 manzana o plátano
1 cucharada de miel
Canela""",
    instrucciones="""Pon el yogurt en un vaso o tupper
Echa la avena encima
Pica la fruta y agrégala
Rocía miel y canela
Mézcla todo""",
    tips="Lo puedes preparar en la noche y llevarlo en un cooler al trabajo. Usa frascos con tapa pa' que no se derrame.",
    es_popular=True
)

Receta.objects.create(
    nombre="Mote con Huesillos (Versión Casera)",
    descripcion_corta="Refresco chileno tradicional y energético",
    descripcion="Perfecto pa' el calor. Dulce natural y nutritivo.",
    categoria=colacion,
    calorias=220,
    proteinas=4,
    carbohidratos=52,
    grasas=1,
    tiempo_preparacion=60,
    porciones=4,
    dificultad="media",
    costo_aproximado=2500.00,
    ingredientes="""1 taza de mote
200g huesillos
Azúcar al gusto
Canela
Cáscara de naranja
Agua""",
    instrucciones="""Remoja el mote desde la noche anterior
Cuece el mote hasta que esté blando
Hierve los huesillos con azúcar, canela y cáscara de naranja
Mezcla el mote con el jugo de huesillos
Deja enfriar en la refri
Sirve bien helado en un vaso grande""",
    tips="Haces harta cantidad el fin de semana y dura toda la semana. Más sano que las bebidas, y te da energía. Lo llevas en botella al trabajo.",
    es_popular=True
)

print("📚 Creando contenido educativo...")

ContenidoEducativo.objects.create(
    titulo="Alimentación del Obrero Chileno",
    descripcion="Por qué necesitas comer bien si trabajas en la construcción",
    tipo="articulo",
    contenido="""
Trabajar en la construcción es de lo más pesado que hay. Tu cuerpo necesita combustible de calidad pa' aguantar.

**¿Por qué es importante?**
- Evitas lesiones y accidentes por mareos o fatiga
- Rindes más en la pega
- No te enfermas tanto
- Llegas a la casa con energía pa' tu familia

**Lo que necesitas todos los días:**
- Proteínas: Carne, pollo, huevos, porotos, lentejas
- Carbohidratos: Pan, arroz, papas, fideos (pa' la energía)
- Verduras: Aunque sea tomate y cebolla en las comidas
- Agua: Mucha, mucha agua

**El desayuno es sagrado:**
No salgas a la pega sin desayunar. Un desayuno completo (huevos con pan, avena, o completo) te mantiene hasta el almuerzo. Si no desayunas, vas a andar mareado y sin fuerza.

**Consejo de maestro:**
Prepara tu comida el domingo. Cocina harto y congela en porciones. Sale más barato que comprar afuera y comes mejor.
    """,
    icono="fa-hard-hat",
    color="orange-500",
    duracion_lectura=6,
    es_destacado=True,
    orden=1
)

ContenidoEducativo.objects.create(
    titulo="Toma Agua, No Bebidas",
    descripcion="La deshidratación es peligrosa en la obra",
    tipo="articulo",
    contenido="""
En la obra, el calor y el esfuerzo te deshidratan rápido. La deshidratación es peligrosa y puede causarte problemas serios.

**Señales de que necesitas agua:**
- Tienes sed (si tienes sed, ya estás deshidratado)
- Dolor de cabeza
- Mareos
- Cansancio extremo
- La orina es muy amarilla

**¿Cuánta agua necesitas?**
Mínimo 8 vasos al día, pero si estás en la obra con calor, necesitas mucha más. Toma agua cada 15-20 minutos mientras trabajas.

**Tips prácticos:**
- Lleva tu bidón grande al trabajo (5 litros mínimo)
- Toma agua antes de tener sed
- Las bebidas no reemplazan el agua
- Si tomas bebidas o jugo, igual necesitas agua aparte
- El agua con limón está bien y es más rica

**Ojo con esto:**
Si te sientes muy mareado, con náuseas o confundido, para de trabajar inmediatamente. Busca sombra, toma agua y dile al jefe. Es mejor parar 15 minutos que terminar en el hospital.
    """,
    icono="fa-tint",
    color="blue-500",
    duracion_lectura=5,
    es_destacado=True,
    orden=2
)

ContenidoEducativo.objects.create(
    titulo="Proteínas Pa' Mantenerte Fuerte",
    descripcion="Por qué la carne, huevos y porotos son importantes",
    tipo="articulo",
    contenido="""
Si trabajas con el cuerpo, necesitas proteína. La proteína repara tus músculos y te mantiene fuerte.

**Fuentes de proteína baratas:**
- Huevos (lo más barato y completo)
- Porotos y lentejas (rinden caleta)
- Pollo (más barato que carne)
- Atún en lata
- Leche y yogurt

**¿Cuánto necesitas?**
Más que una persona de oficina. Si pesas 80 kilos, necesitas unos 120g de proteína al día.

**Ejemplos:**
- 2 huevos = 12g proteína
- 1 taza de porotos = 15g proteína
- 100g de pollo = 30g proteína
- 1 lata de atún = 25g proteína

**Consejo maestro:**
Los porotos con rienda, cazuela, o charquicán te dan harta proteína y son baratos. Un kilo de porotos rinde pa' toda la semana y cuesta poco.

**Pa' ahorrar:**
Compra el huevo por maple, el pollo entero (no en presas), y los porotos secos. Sale mucho más barato que comprar comida preparada.
    """,
    icono="fa-drumstick-bite",
    color="red-500",
    duracion_lectura=5,
    es_destacado=False,
    orden=3
)

# Tips rápidos
ContenidoEducativo.objects.create(
    titulo="Lleva colación a la obra",
    descripcion="Un plátano con maní te da energía pa' toda la tarde",
    tipo="tip",
    contenido="No compres dulces ni bebidas. Lleva fruta y frutos secos, más baratos y más sanos.",
    icono="fa-apple-alt",
    color="green-500",
    duracion_lectura=1,
    orden=10
)

ContenidoEducativo.objects.create(
    titulo="Cocina los domingos",
    descripcion="Prepara toda tu comida de la semana el domingo",
    tipo="tip",
    contenido="Haces harta comida, la divides en tuppers y congelas. Sales más barato y comes mejor que comprando afuera.",
    icono="fa-calendar",
    color="purple-500",
    duracion_lectura=1,
    orden=11
)

ContenidoEducativo.objects.create(
    titulo="Evita las bebidas",
    descripcion="La bebida y el jugo son puro azúcar",
    tipo="tip",
    contenido="Toma agua o mote con huesillos casero. Las bebidas te dan energía por 10 minutos y después te dejan más cansado.",
    icono="fa-ban",
    color="red-500",
    duracion_lectura=1,
    orden=12
)

ContenidoEducativo.objects.create(
    titulo="Duerme bien",
    descripcion="Necesitas 7-8 horas pa' recuperarte",
    tipo="tip",
    contenido="Si no duermes, te vas a lesionar. Tu cuerpo se repara mientras duermes. No es flojera, es necesidad.",
    icono="fa-bed",
    color="indigo-500",
    duracion_lectura=1,
    orden=13
)

ContenidoEducativo.objects.create(
    titulo="Pan amasado mejor que marraqueta",
    descripcion="El pan amasado tiene más calorías y te mantiene con energía",
    tipo="tip",
    contenido="Si trabajas pesado, necesitas las calorías del pan amasado. No es malo, tu cuerpo lo necesita.",
    icono="fa-bread-slice",
    color="yellow-500",
    duracion_lectura=1,
    orden=14
)

print("❓ Creando preguntas del quiz...")

PreguntaQuiz.objects.create(
    pregunta="¿Cuál es la comida más importante del día pa' un obrero?",
    opcion_a="La once",
    opcion_b="El desayuno",
    opcion_c="El almuerzo",
    opcion_d="Da lo mismo",
    respuesta_correcta="b",
    explicacion="El desayuno te da la energía pa' empezar la pega. Sin desayuno vas a andar mareado y sin fuerza toda la mañana.",
    categoria="Nutrición Básica",
    nivel_dificultad=1
)

PreguntaQuiz.objects.create(
    pregunta="¿Cuánta agua debes tomar en la obra?",
    opcion_a="Solo cuando tengas sed",
    opcion_b="2-3 vasos al día",
    opcion_c="8 vasos o más, mucho más si hace calor",
    opcion_d="Las bebidas cuentan igual",
    respuesta_correcta="c",
    explicacion="En la obra necesitas mucha agua, especialmente con calor. Toma cada 15-20 minutos, no esperes a tener sed.",
    categoria="Hidratación",
    nivel_dificultad=1
)

PreguntaQuiz.objects.create(
    pregunta="¿Qué nutriente repara tus músculos después de la pega?",
    opcion_a="El azúcar",
    opcion_b="La proteína",
    opcion_c="La grasa",
    opcion_d="Las bebidas",
    respuesta_correcta="b",
    explicacion="La proteína (de la carne, huevos, porotos) es la que repara tus músculos. Por eso necesitas comer proteína todos los días.",
    categoria="Nutrición Básica",
    nivel_dificultad=1
)

PreguntaQuiz.objects.create(
    pregunta="¿Cuál es la fuente de proteína más barata?",
    opcion_a="Bebidas proteicas caras",
    opcion_b="Carne importada",
    opcion_c="Huevos y porotos",
    opcion_d="Suplementos de gimnasio",
    respuesta_correcta="c",
    explicacion="Los huevos y porotos son lo más barato y completo. Un maple de huevos y un kilo de porotos te duran toda la semana.",
    categoria="Economía",
    nivel_dificultad=1
)

PreguntaQuiz.objects.create(
    pregunta="Si te mareas y tienes mucha sed en la obra, ¿qué haces?",
    opcion_a="Sigues trabajando no más",
    opcion_b="Tomas una bebida",
    opcion_c="Paras, buscas sombra y tomas agua",
    opcion_d="Te aguantas hasta el almuerzo",
    respuesta_correcta="c",
    explicacion="Los mareos con sed son señal de deshidratación. Es peligroso, tienes que parar inmediatamente, buscar sombra y tomar agua. Si no mejoras, avisas al jefe.",
    categoria="Seguridad",
    nivel_dificultad=2
)

PreguntaQuiz.objects.create(
    pregunta="¿Qué es mejor pa' tener energía toda la mañana?",
    opcion_a="Bebidas y dulces",
    opcion_b="Solo café",
    opcion_c="Desayuno con huevos, pan y fruta",
    opcion_d="No desayunar pa' ahorrar tiempo",
    respuesta_correcta="c",
    explicacion="Un desayuno completo te da energía que dura. Los dulces y bebidas te dan energía por 10 minutos nomás, después quedas más cansado.",
    categoria="Energía",
    nivel_dificultad=2
)

PreguntaQuiz.objects.create(
    pregunta="¿Por qué los porotos son buenos pa' los obreros?",
    opcion_a="Solo porque son baratos",
    opcion_b="Tienen proteína, fibra y hierro",
    opcion_c="No sirven pa' nada",
    opcion_d="Solo pa' llenar la guata",
    respuesta_correcta="b",
    explicacion="Los porotos son un superalimento: tienen proteína, fibra que te mantiene lleno, y hierro que te da energía. Además son re baratos.",
    categoria="Nutrición",
    nivel_dificultad=2
)

PreguntaQuiz.objects.create(
    pregunta="¿Cuánto debes dormir pa' recuperarte de la pega?",
    opcion_a="4-5 horas, hay que trabajar",
    opcion_b="Lo que se pueda",
    opcion_c="7-8 horas",
    opcion_d="No importa",
    respuesta_correcta="c",
    explicacion="Necesitas 7-8 horas pa' que tu cuerpo se recupere. Si no duermes, te vas a lesionar y vas a rendir menos. No es flojera, es necesidad.",
    categoria="Descanso",
    nivel_dificultad=1
)

PreguntaQuiz.objects.create(
    pregunta="¿Qué es mejor llevar de colación a la obra?",
    opcion_a="Bebidas y papas fritas",
    opcion_b="Plátano con maní",
    opcion_c="Puras galletas",
    opcion_d="Dulces",
    respuesta_correcta="b",
    explicacion="El plátano te da energía rápida y el maní tiene proteína pa' que te dure. Es más barato que los dulces y mucho más sano.",
    categoria="Colaciones",
    nivel_dificultad=1
)

PreguntaQuiz.objects.create(
    pregunta="¿Cómo puedes ahorrar en comida siendo obrero?",
    opcion_a="No comer tanto",
    opcion_b="Cocinar harto el domingo y congelar",
    opcion_c="Comprar comida preparada todos los días",
    opcion_d="Solo comer pan",
    respuesta_correcta="b",
    explicacion="Si cocinas harto el domingo y congelas, comes mejor y más barato. Sale mucho menos que comprar todos los días. Un kilo de porotos te da pa' toda la semana.",
    categoria="Economía",
    nivel_dificultad=2
)

print("🏆 Creando logros...")

Logro.objects.create(
    nombre="Primera Receta",
    descripcion="Preparaste tu primera receta",
    icono="fa-utensils",
    color="primary-500",
    condicion="primera_receta",
    puntos=10
)

Logro.objects.create(
    nombre="Chef de Obra",
    descripcion="Preparaste 5 recetas diferentes",
    icono="fa-hard-hat",
    color="orange-500",
    condicion="cinco_recetas",
    puntos=25
)

Logro.objects.create(
    nombre="Maestro Cocinero",
    descripcion="Preparaste 10 recetas diferentes",
    icono="fa-award",
    color="yellow-500",
    condicion="diez_recetas",
    puntos=50
)

Logro.objects.create(
    nombre="Estudiante Aplicado",
    descripcion="Completaste tu primer quiz",
    icono="fa-graduation-cap",
    color="blue-500",
    condicion="primer_quiz",
    puntos=15
)

Logro.objects.create(
    nombre="Puntaje Perfecto",
    descripcion="Sacaste 100% en un quiz",
    icono="fa-star",
    color="yellow-500",
    condicion="quiz_perfecto",
    puntos=50
)

Logro.objects.create(
    nombre="Una Semana Constante",
    descripcion="Mantuviste una racha de 7 días",
    icono="fa-fire",
    color="red-500",
    condicion="racha_7",
    puntos=40
)

print("\n✅ ¡Base de datos poblada con recetas chilenas pa' obreros!")
print(f"📊 Estadísticas:")
print(f"   - Categorías: {CategoriaReceta.objects.count()}")
print(f"   - Recetas: {Receta.objects.count()}")
print(f"   - Contenido Educativo: {ContenidoEducativo.objects.count()}")
print(f"   - Preguntas Quiz: {PreguntaQuiz.objects.count()}")
print(f"   - Logros: {Logro.objects.count()}")
