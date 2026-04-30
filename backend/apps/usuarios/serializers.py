from django.contrib.auth.models import User
from rest_framework import serializers
from .models import PerfilUsuario, CalculoNutricional, RecetaFavorita, ProgresoAprendizaje, Logro, LogroDesbloqueado


# ─── Auth ───────────────────────────────────────────────────────────────────

class RegistroSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, min_length=8)
    password2 = serializers.CharField(write_only=True, label='Confirmar contraseña')

    class Meta:
        model = User
        fields = ['username', 'email', 'first_name', 'last_name', 'password', 'password2']

    def validate(self, data):
        if data['password'] != data['password2']:
            raise serializers.ValidationError({'password2': 'Las contraseñas no coinciden.'})
        return data

    def create(self, validated_data):
        validated_data.pop('password2')
        password = validated_data.pop('password')
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user


# ─── Perfil ─────────────────────────────────────────────────────────────────

class PerfilSerializer(serializers.ModelSerializer):
    username = serializers.CharField(source='user.username', read_only=True)
    email = serializers.EmailField(source='user.email', read_only=True)
    first_name = serializers.CharField(source='user.first_name', read_only=True)
    last_name = serializers.CharField(source='user.last_name', read_only=True)
    date_joined = serializers.DateTimeField(source='user.date_joined', read_only=True)

    class Meta:
        model = PerfilUsuario
        fields = [
            'id', 'username', 'email', 'first_name', 'last_name',
            'fecha_nacimiento', 'telefono', 'avatar',
            'puntos_totales', 'nivel', 'date_joined', 'created_at',
        ]
        read_only_fields = ['puntos_totales', 'nivel', 'created_at']


class PerfilUpdateSerializer(serializers.ModelSerializer):
    first_name = serializers.CharField(source='user.first_name')
    last_name = serializers.CharField(source='user.last_name')
    email = serializers.EmailField(source='user.email')

    class Meta:
        model = PerfilUsuario
        fields = ['first_name', 'last_name', 'email', 'fecha_nacimiento', 'telefono', 'avatar']

    def update(self, instance, validated_data):
        user_data = validated_data.pop('user', {})
        for attr, value in user_data.items():
            setattr(instance.user, attr, value)
        instance.user.save()
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance


# ─── Calculadora ────────────────────────────────────────────────────────────

class CalculoInputSerializer(serializers.Serializer):
    peso = serializers.FloatField(min_value=20, max_value=300)
    altura = serializers.FloatField(min_value=100, max_value=250)
    edad = serializers.IntegerField(min_value=10, max_value=120)
    genero = serializers.ChoiceField(choices=['masculino', 'femenino'])
    nivel_actividad = serializers.ChoiceField(
        choices=['sedentario', 'ligero', 'moderado', 'activo', 'muy_activo']
    )
    objetivo = serializers.ChoiceField(choices=['perder', 'mantener', 'ganar'])


class CalculoNutricionalSerializer(serializers.ModelSerializer):
    class Meta:
        model = CalculoNutricional
        fields = '__all__'
        read_only_fields = ['user', 'fecha']


# ─── Favoritos ──────────────────────────────────────────────────────────────

class RecetaFavoritaSerializer(serializers.ModelSerializer):
    class Meta:
        model = RecetaFavorita
        fields = ['id', 'receta_id', 'receta_nombre', 'fecha_agregada']
        read_only_fields = ['fecha_agregada']


# ─── Aprendizaje ────────────────────────────────────────────────────────────

class ProgresoAprendizajeSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProgresoAprendizaje
        fields = '__all__'
        read_only_fields = ['user', 'created_at', 'updated_at']


# ─── Logros ─────────────────────────────────────────────────────────────────

class LogroSerializer(serializers.ModelSerializer):
    class Meta:
        model = Logro
        fields = '__all__'


class LogroDesbloqueadoSerializer(serializers.ModelSerializer):
    logro = LogroSerializer(read_only=True)

    class Meta:
        model = LogroDesbloqueado
        fields = ['id', 'logro', 'fecha_desbloqueado']
