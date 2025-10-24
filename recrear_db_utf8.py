#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
Script para recrear la base de datos PostgreSQL con codificación UTF-8
"""

try:
    import psycopg2
    from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT
except ImportError:
    import psycopg2 as psycopg2
    from psycopg2.extensions import ISOLATION_LEVEL_AUTOCOMMIT

# Configuración
DB_NAME = 'obrafit_db'
DB_USER = 'postgres'
DB_PASSWORD = 'Eternity'
DB_HOST = 'localhost'
DB_PORT = '5432'

print("🔧 Conectando a PostgreSQL...")

# Conectar a la base de datos postgres (por defecto)
try:
    conn = psycopg2.connect(
        dbname='postgres',
        user=DB_USER,
        password=DB_PASSWORD,
        host=DB_HOST,
        port=DB_PORT
    )
    conn.set_isolation_level(ISOLATION_LEVEL_AUTOCOMMIT)
    cursor = conn.cursor()
    
    print(f"📊 Verificando si existe la base de datos '{DB_NAME}'...")
    
    # Terminar todas las conexiones activas a la base de datos
    cursor.execute(f"""
        SELECT pg_terminate_backend(pg_stat_activity.pid)
        FROM pg_stat_activity
        WHERE pg_stat_activity.datname = '{DB_NAME}'
          AND pid <> pg_backend_pid();
    """)
    
    print(f"🗑️ Eliminando base de datos '{DB_NAME}' si existe...")
    cursor.execute(f"DROP DATABASE IF EXISTS {DB_NAME};")
    
    print(f"✨ Creando base de datos '{DB_NAME}' con codificación UTF-8...")
    cursor.execute(f"""
        CREATE DATABASE {DB_NAME}
        WITH 
        OWNER = {DB_USER}
        ENCODING = 'UTF8'
        LC_COLLATE = 'C'
        LC_CTYPE = 'C'
        TEMPLATE = template0;
    """)
    
    print(f"✅ Base de datos '{DB_NAME}' creada exitosamente con UTF-8!")
    
    # Verificar la codificación
    cursor.execute(f"""
        SELECT pg_encoding_to_char(encoding) 
        FROM pg_database 
        WHERE datname = '{DB_NAME}';
    """)
    encoding = cursor.fetchone()[0]
    print(f"📝 Codificación de la base de datos: {encoding}")
    
    cursor.close()
    conn.close()
    
    print("\n✅ ¡Proceso completado! Ahora ejecuta las migraciones:")
    print("   python manage.py migrate")
    print("   Get-Content poblar_db_chile.py | python manage.py shell")
    
except Exception as e:
    print(f"❌ Error: {e}")
    import traceback
    traceback.print_exc()
