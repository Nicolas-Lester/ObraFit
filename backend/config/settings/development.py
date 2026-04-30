"""
Configuración de desarrollo para ObraFit.
Usa PostgreSQL vía Docker Compose.
"""
from .base import *

DEBUG = True

ALLOWED_HOSTS = ['localhost', '127.0.0.1', '0.0.0.0']

# Base de datos PostgreSQL (Docker)
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': os.environ.get('POSTGRES_DB', 'obrafit_db'),
        'USER': os.environ.get('POSTGRES_USER', 'obrafit_user'),
        'PASSWORD': os.environ.get('POSTGRES_PASSWORD', 'obrafit_pass'),
        'HOST': os.environ.get('POSTGRES_HOST', 'db'),
        'PORT': os.environ.get('POSTGRES_PORT', '5432'),
        'OPTIONS': {'client_encoding': 'UTF8'},
        'CONN_MAX_AGE': 60,
    }
}

# CORS: permite el frontend React en desarrollo
CORS_ALLOWED_ORIGINS = [
    'http://localhost:3000',
    'http://localhost:5173',
    'http://127.0.0.1:5173',
]
CORS_ALLOW_CREDENTIALS = True

# Email (consola en desarrollo)
EMAIL_BACKEND = 'django.core.mail.backends.console.EmailBackend'
