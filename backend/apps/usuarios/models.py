from django.db import models
from django.contrib.auth.models import User


class PerfilUsuario(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='perfil')
    fecha_nacimiento = models.DateField(null=True, blank=True)
    telefono = models.CharField(max_length=20, blank=True)
    avatar = models.CharField(max_length=10, default='👤')
    puntos_totales = models.IntegerField(default=0)
    nivel = models.IntegerField(default=1)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Perfil de Usuario'
        verbose_name_plural = 'Perfiles de Usuarios'

    def __str__(self):
        return f'Perfil de {self.user.username}'


class CalculoNutricional(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='calculos')
    peso = models.FloatField()
    altura = models.FloatField()
    edad = models.IntegerField()
    genero = models.CharField(max_length=10)
    nivel_actividad = models.CharField(max_length=50)
    objetivo = models.CharField(max_length=50)
    calorias_diarias = models.FloatField()
    proteinas = models.FloatField()
    carbohidratos = models.FloatField()
    grasas = models.FloatField()
    fecha = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'Cálculo Nutricional'
        verbose_name_plural = 'Cálculos Nutricionales'
        ordering = ['-fecha']

    def __str__(self):
        return f'Cálculo de {self.user.username} - {self.fecha.strftime("%d/%m/%Y")}'


class RecetaFavorita(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='recetas_favoritas')
    receta_id = models.IntegerField()
    receta_nombre = models.CharField(max_length=200)
    fecha_agregada = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'Receta Favorita'
        verbose_name_plural = 'Recetas Favoritas'
        unique_together = ['user', 'receta_id']
        ordering = ['-fecha_agregada']

    def __str__(self):
        return f'{self.user.username} - {self.receta_nombre}'


class ProgresoAprendizaje(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='progreso_aprendizaje')
    leccion_id = models.CharField(max_length=50)
    leccion_nombre = models.CharField(max_length=200)
    completada = models.BooleanField(default=False)
    puntuacion = models.IntegerField(default=0)
    intentos = models.IntegerField(default=0)
    fecha_completada = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        verbose_name = 'Progreso de Aprendizaje'
        verbose_name_plural = 'Progreso de Aprendizaje'
        unique_together = ['user', 'leccion_id']

    def __str__(self):
        return f'{self.user.username} - {self.leccion_nombre}'


class Logro(models.Model):
    nombre = models.CharField(max_length=100)
    descripcion = models.TextField()
    icono = models.CharField(max_length=10, default='🏆')
    puntos = models.IntegerField(default=10)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'Logro'
        verbose_name_plural = 'Logros'

    def __str__(self):
        return self.nombre


class LogroDesbloqueado(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='logros')
    logro = models.ForeignKey(Logro, on_delete=models.CASCADE)
    fecha_desbloqueado = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name = 'Logro Desbloqueado'
        verbose_name_plural = 'Logros Desbloqueados'
        unique_together = ['user', 'logro']

    def __str__(self):
        return f'{self.user.username} - {self.logro.nombre}'
