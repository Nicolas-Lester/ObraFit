#!/bin/sh
set -e

echo "⏳ Esperando a que la base de datos esté disponible..."
python << 'EOF'
import time, os, psycopg2

host = os.environ.get("POSTGRES_HOST", "db")
port = int(os.environ.get("POSTGRES_PORT", 5432))
db   = os.environ.get("POSTGRES_DB", "obrafit_db")
user = os.environ.get("POSTGRES_USER", "obrafit_user")
pw   = os.environ.get("POSTGRES_PASSWORD", "obrafit_pass")

retries = 30
while retries > 0:
    try:
        psycopg2.connect(host=host, port=port, dbname=db, user=user, password=pw)
        print("✅ Base de datos lista.")
        break
    except psycopg2.OperationalError:
        retries -= 1
        print(f"   Reintentando... ({retries} intentos restantes)")
        time.sleep(2)
else:
    print("❌ No se pudo conectar a la base de datos.")
    exit(1)
EOF

echo "🔄 Aplicando migraciones..."
python manage.py migrate --noinput

echo "📦 Recolectando archivos estáticos..."
python manage.py collectstatic --noinput

echo "🚀 Iniciando servidor..."
exec gunicorn config.wsgi:application \
    --bind 0.0.0.0:8000 \
    --workers 3 \
    --timeout 120 \
    --access-logfile - \
    --error-logfile -
