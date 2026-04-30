from django.db import models
from django.core.validators import MinValueValidator


class CategoriaReceta(models.Model):
    TIPO_COMIDA_CHOICES = [
        ('desayuno', 'Desayuno'),
        ('almuerzo', 'Almuerzo'),
        ('cena', 'Cena'),
        ('snack', 'Snack'),
    ]

    nombre = models.CharField(max_length=100)
    tipo_comida = models.CharField(max_length=20, choices=TIPO_COMIDA_CHOICES)
    icono = models.CharField(max_length=50, default='fa-utensils')
    color = models.CharField(max_length=50, default='primary-500')
    descripcion = models.TextField()

    class Meta:
        verbose_name = 'Categoría de Receta'
        verbose_name_plural = 'Categorías de Recetas'
        ordering = ['nombre']

    def __str__(self):
        return f"{self.nombre} - {self.get_tipo_comida_display()}"


class Receta(models.Model):
    DIFICULTAD_CHOICES = [
        ('facil', 'Fácil'),
        ('media', 'Media'),
        ('dificil', 'Difícil'),
    ]

    nombre = models.CharField(max_length=200)
    descripcion_corta = models.CharField(max_length=300)
    descripcion = models.TextField()
    categoria = models.ForeignKey(
        CategoriaReceta, on_delete=models.CASCADE, related_name='recetas'
    )

    # Información nutricional
    calorias = models.IntegerField(validators=[MinValueValidator(0)])
    proteinas = models.DecimalField(max_digits=5, decimal_places=1)
    carbohidratos = models.DecimalField(max_digits=5, decimal_places=1)
    grasas = models.DecimalField(max_digits=5, decimal_places=1)

    # Detalles
    tiempo_preparacion = models.IntegerField(help_text='Tiempo en minutos')
    porciones = models.IntegerField(validators=[MinValueValidator(1)])
    dificultad = models.CharField(max_length=20, choices=DIFICULTAD_CHOICES, default='facil')
    costo_aproximado = models.DecimalField(
        max_digits=6, decimal_places=2, help_text='Costo en pesos chilenos'
    )

    ingredientes = models.TextField(help_text='Un ingrediente por línea')
    instrucciones = models.TextField(help_text='Pasos de preparación, uno por línea')

    imagen_url = models.URLField(blank=True, null=True)
    tips = models.TextField(blank=True)
    es_popular = models.BooleanField(default=False)
    creado_en = models.DateTimeField(auto_now_add=True)
    actualizado_en = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Receta'
        verbose_name_plural = 'Recetas'
        ordering = ['-es_popular', 'nombre']

    def __str__(self):
        return self.nombre

    def get_ingredientes_lista(self):
        return [i.strip() for i in self.ingredientes.split('\n') if i.strip()]

    def get_instrucciones_lista(self):
        return [i.strip() for i in self.instrucciones.split('\n') if i.strip()]


class ContenidoEducativo(models.Model):
    TIPO_CHOICES = [
        ('articulo', 'Artículo'),
        ('video', 'Video'),
        ('infografia', 'Infografía'),
        ('tip', 'Consejo Rápido'),
    ]

    titulo = models.CharField(max_length=200)
    descripcion = models.TextField()
    tipo = models.CharField(max_length=20, choices=TIPO_CHOICES)
    contenido = models.TextField()
    icono = models.CharField(max_length=50, default='fa-book')
    color = models.CharField(max_length=50, default='mint-500')
    duracion_lectura = models.IntegerField(help_text='Minutos estimados', default=5)
    orden = models.IntegerField(default=0)
    es_destacado = models.BooleanField(default=False)
    activo = models.BooleanField(default=True)
    creado_en = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'Contenido Educativo'
        verbose_name_plural = 'Contenidos Educativos'
        ordering = ['orden', '-es_destacado', 'titulo']

    def __str__(self):
        return f"{self.titulo} ({self.get_tipo_display()})"


class PreguntaQuiz(models.Model):
    pregunta = models.TextField()
    opcion_a = models.CharField(max_length=200)
    opcion_b = models.CharField(max_length=200)
    opcion_c = models.CharField(max_length=200)
    opcion_d = models.CharField(max_length=200)
    respuesta_correcta = models.CharField(
        max_length=1,
        choices=[('a', 'A'), ('b', 'B'), ('c', 'C'), ('d', 'D')],
    )
    explicacion = models.TextField(blank=True)
    activa = models.BooleanField(default=True)
    creado_en = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'Pregunta de Quiz'
        verbose_name_plural = 'Preguntas de Quiz'

    def __str__(self):
        return self.pregunta[:80]
