from django import forms
from django.contrib.auth.forms import UserCreationForm, AuthenticationForm
from django.contrib.auth.models import User


class RegistroForm(UserCreationForm):
    email = forms.EmailField(
        required=True,
        widget=forms.EmailInput(attrs={
            'class': 'w-full px-4 py-3 rounded-lg border border-warm-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all',
            'placeholder': 'tu@email.com'
        })
    )
    username = forms.CharField(
        max_length=150,
        widget=forms.TextInput(attrs={
            'class': 'w-full px-4 py-3 rounded-lg border border-warm-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all',
            'placeholder': 'Nombre de usuario'
        })
    )
    first_name = forms.CharField(
        max_length=150,
        required=True,
        widget=forms.TextInput(attrs={
            'class': 'w-full px-4 py-3 rounded-lg border border-warm-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all',
            'placeholder': 'Tu nombre'
        })
    )
    last_name = forms.CharField(
        max_length=150,
        required=False,
        widget=forms.TextInput(attrs={
            'class': 'w-full px-4 py-3 rounded-lg border border-warm-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all',
            'placeholder': 'Apellido (opcional)'
        })
    )
    password1 = forms.CharField(
        widget=forms.PasswordInput(attrs={
            'class': 'w-full px-4 py-3 rounded-lg border border-warm-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all',
            'placeholder': 'Contraseña'
        })
    )
    password2 = forms.CharField(
        widget=forms.PasswordInput(attrs={
            'class': 'w-full px-4 py-3 rounded-lg border border-warm-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all',
            'placeholder': 'Confirma tu contraseña'
        })
    )

    class Meta:
        model = User
        fields = ['username', 'first_name', 'last_name', 'email', 'password1', 'password2']

    def clean_email(self):
        email = self.cleaned_data.get('email')
        if User.objects.filter(email=email).exists():
            raise forms.ValidationError('Este correo electrónico ya está registrado.')
        return email


class LoginForm(AuthenticationForm):
    username = forms.CharField(
        widget=forms.TextInput(attrs={
            'class': 'w-full px-4 py-3 rounded-lg border border-warm-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all',
            'placeholder': 'Nombre de usuario o email'
        })
    )
    password = forms.CharField(
        widget=forms.PasswordInput(attrs={
            'class': 'w-full px-4 py-3 rounded-lg border border-warm-300 focus:border-primary-500 focus:ring-2 focus:ring-primary-200 transition-all',
            'placeholder': 'Contraseña'
        })
    )
