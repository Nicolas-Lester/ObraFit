from django.db import migrations, models
import django.core.validators
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = []

    operations = [
        migrations.CreateModel(
            name='CategoriaReceta',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nombre', models.CharField(max_length=100)),
                ('tipo_comida', models.CharField(choices=[('desayuno', 'Desayuno'), ('almuerzo', 'Almuerzo'), ('cena', 'Cena'), ('snack', 'Snack')], max_length=20)),
                ('icono', models.CharField(default='fa-utensils', max_length=50)),
                ('color', models.CharField(default='primary-500', max_length=50)),
                ('descripcion', models.TextField()),
            ],
            options={
                'verbose_name': 'Categoría de Receta',
                'verbose_name_plural': 'Categorías de Recetas',
                'ordering': ['nombre'],
            },
        ),
        migrations.CreateModel(
            name='ContenidoEducativo',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('titulo', models.CharField(max_length=200)),
                ('descripcion', models.TextField()),
                ('tipo', models.CharField(choices=[('articulo', 'Artículo'), ('video', 'Video'), ('infografia', 'Infografía'), ('tip', 'Consejo Rápido')], max_length=20)),
                ('contenido', models.TextField()),
                ('icono', models.CharField(default='fa-book', max_length=50)),
                ('color', models.CharField(default='mint-500', max_length=50)),
                ('duracion_lectura', models.IntegerField(default=5, help_text='Minutos estimados')),
                ('orden', models.IntegerField(default=0)),
                ('es_destacado', models.BooleanField(default=False)),
                ('activo', models.BooleanField(default=True)),
                ('creado_en', models.DateTimeField(auto_now_add=True)),
            ],
            options={
                'verbose_name': 'Contenido Educativo',
                'verbose_name_plural': 'Contenidos Educativos',
                'ordering': ['orden', '-es_destacado', 'titulo'],
            },
        ),
        migrations.CreateModel(
            name='PreguntaQuiz',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('pregunta', models.TextField()),
                ('opcion_a', models.CharField(max_length=200)),
                ('opcion_b', models.CharField(max_length=200)),
                ('opcion_c', models.CharField(max_length=200)),
                ('opcion_d', models.CharField(max_length=200)),
                ('respuesta_correcta', models.CharField(choices=[('a', 'A'), ('b', 'B'), ('c', 'C'), ('d', 'D')], max_length=1)),
                ('explicacion', models.TextField(blank=True)),
                ('activa', models.BooleanField(default=True)),
                ('creado_en', models.DateTimeField(auto_now_add=True)),
            ],
            options={
                'verbose_name': 'Pregunta de Quiz',
                'verbose_name_plural': 'Preguntas de Quiz',
            },
        ),
        migrations.CreateModel(
            name='Receta',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('nombre', models.CharField(max_length=200)),
                ('descripcion_corta', models.CharField(max_length=300)),
                ('descripcion', models.TextField()),
                ('categoria', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='recetas', to='recetas.categoriareceta')),
                ('calorias', models.IntegerField(validators=[django.core.validators.MinValueValidator(0)])),
                ('proteinas', models.DecimalField(decimal_places=1, max_digits=5)),
                ('carbohidratos', models.DecimalField(decimal_places=1, max_digits=5)),
                ('grasas', models.DecimalField(decimal_places=1, max_digits=5)),
                ('tiempo_preparacion', models.IntegerField(help_text='Tiempo en minutos')),
                ('porciones', models.IntegerField(validators=[django.core.validators.MinValueValidator(1)])),
                ('dificultad', models.CharField(choices=[('facil', 'Fácil'), ('media', 'Media'), ('dificil', 'Difícil')], default='facil', max_length=20)),
                ('costo_aproximado', models.DecimalField(decimal_places=2, help_text='Costo en pesos chilenos', max_digits=6)),
                ('ingredientes', models.TextField(help_text='Un ingrediente por línea')),
                ('instrucciones', models.TextField(help_text='Pasos de preparación, uno por línea')),
                ('imagen_url', models.URLField(blank=True, null=True)),
                ('tips', models.TextField(blank=True)),
                ('es_popular', models.BooleanField(default=False)),
                ('creado_en', models.DateTimeField(auto_now_add=True)),
                ('actualizado_en', models.DateTimeField(auto_now=True)),
            ],
            options={
                'verbose_name': 'Receta',
                'verbose_name_plural': 'Recetas',
                'ordering': ['-es_popular', 'nombre'],
            },
        ),
    ]
