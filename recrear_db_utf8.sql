-- Script para recrear la base de datos con UTF-8
-- Ejecutar como superusuario de PostgreSQL

-- Desconectar todas las conexiones actuales
SELECT pg_terminate_backend(pg_stat_activity.pid)
FROM pg_stat_activity
WHERE pg_stat_activity.datname = 'obrafit_db'
  AND pid <> pg_backend_pid();

-- Eliminar la base de datos anterior
DROP DATABASE IF EXISTS obrafit_db;

-- Crear la base de datos con codificación UTF-8
CREATE DATABASE obrafit_db
    WITH 
    OWNER = postgres
    ENCODING = 'UTF8'
    LC_COLLATE = 'Spanish_Chile.1252'
    LC_CTYPE = 'Spanish_Chile.1252'
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1;

-- Comentario
COMMENT ON DATABASE obrafit_db
    IS 'Base de datos ObraFit con codificación UTF-8 para caracteres en español';
