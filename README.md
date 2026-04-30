# 🏗️ ObraFit

Plataforma digital de bienestar y nutrición para trabajadores de la construcción en Chile.

---

## Arquitectura

```
ObraFit/
├── backend/          # Django REST Framework + PostgreSQL
├── frontend/         # React 18 + Vite + TailwindCSS
├── docker-compose.yml
└── .env.example
```

| Capa | Tecnología |
|------|-----------|
| API | Django 5.2 + DRF 3.15 + JWT |
| Base de datos | PostgreSQL 16 |
| Frontend | React 18 + Vite + TailwindCSS |
| Contenedores | Docker + docker-compose |

---

## Modo 1: Probar la aplicación (Docker)

> Usa este modo cuando quieras ver la aplicación funcionando completa, sin instalar Python ni Node en tu máquina.

**Requisitos:** Docker Desktop instalado y corriendo.

```bash
# 1. Clonar el repositorio
git clone https://github.com/Nicolas-Lester/ObraFit.git
cd ObraFit

# 2. Crear el archivo de entorno
cp .env.example .env   # En Windows: Copy-Item .env.example .env
# Edita .env con tus valores (al menos SECRET_KEY y POSTGRES_PASSWORD)

# 3. Levantar todos los servicios
docker-compose up --build
```

**URLs disponibles:**

| URL | Descripción |
|-----|-------------|
| `http://localhost` | Frontend React (aplicación completa) |
| `http://localhost/api/` | API REST Django |
| `http://localhost/admin/` | Panel de administración Django |

> Todos los servicios corren detrás de Nginx en el puerto 80. El backend **no** tiene puerto expuesto directamente.

Para crear un superusuario (acceso al admin):
```bash
docker-compose exec backend python manage.py createsuperuser
```

Para inspeccionar la base de datos con pgAdmin:
- Host: `localhost`, Puerto: `5432`
- Base de datos: `obrafit_db`, Usuario: `obrafit_user`, Contraseña: `obrafit_pass`

O por consola:
```bash
docker-compose exec db psql -U obrafit_user -d obrafit_db
```

Para detener:
```bash
docker-compose down          # detiene los contenedores
docker-compose down -v       # detiene y borra los datos
```

---

## Modo 2: Desarrollo local (backend y frontend por separado)

> Usa este modo cuando estés programando activamente. Obtienes hot-reload en el frontend y el servidor de Django con recarga automática.

**Requisitos:** Python 3.12+, Node 20+, Docker Desktop (solo para la base de datos).

### Paso 1 — Levantar solo la base de datos

```bash
docker-compose up db -d
```

### Paso 2 — Backend Django (Terminal 1)

```bash
cd backend

# Primera vez: crear entorno virtual
python -m venv venv
.\venv\Scripts\activate        # Windows
# source venv/bin/activate     # Linux/Mac

pip install -r requirements.txt

# Variables de entorno necesarias
$env:DJANGO_SETTINGS_MODULE = "config.settings.development"
$env:POSTGRES_HOST = "localhost"      # importante: no usar "db"
$env:POSTGRES_PASSWORD = "obrafit_pass"

python manage.py migrate
python manage.py runserver
```

Backend disponible en:

| URL | Descripción |
|-----|-------------|
| `http://localhost:8000/api/` | API REST Django |
| `http://localhost:8000/admin/` | Panel de administración Django |

### Paso 3 — Frontend React (Terminal 2)

```bash
cd frontend
npm install
npm run dev
```

Frontend disponible en `http://localhost:5173`  
El proxy de Vite reenvía automáticamente `/api/` → `http://localhost:8000`.

### (Opcional) Poblar la base de datos con datos de prueba

```bash
# Con el entorno virtual activado, desde la carpeta backend:
python scripts/poblar_db_chile.py
```

---

## Resumen de puertos

| Modo | Frontend | Backend API | Admin Django | PostgreSQL |
|------|----------|-------------|--------------|------------|
| Docker (Modo 1) | `localhost` (80) | `localhost/api/` | `localhost/admin/` | `localhost:5432` |
| Desarrollo local (Modo 2) | `localhost:5173` | `localhost:8000/api/` | `localhost:8000/admin/` | `localhost:5432` |

---

## Variables de entorno

| Variable | Descripción | Default (dev) |
|----------|-------------|---------------|
| `SECRET_KEY` | Django secret key | — (requerida) |
| `DJANGO_SETTINGS_MODULE` | Módulo de settings | `config.settings.development` |
| `POSTGRES_DB` | Nombre de la BD | `obrafit_db` |
| `POSTGRES_USER` | Usuario PostgreSQL | `obrafit_user` |
| `POSTGRES_PASSWORD` | Contraseña | — (requerida) |
| `POSTGRES_HOST` | Host PostgreSQL | `db` (Docker) / `localhost` (local) |
| `POSTGRES_PORT` | Puerto | `5432` |
| `CORS_ALLOWED_ORIGINS` | Orígenes CORS en producción | — |

---

## API Endpoints

### Autenticación
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/api/auth/token/` | Obtener tokens JWT |
| POST | `/api/auth/token/refresh/` | Renovar access token |
| POST | `/api/auth/registro/` | Crear cuenta |

### Recetas
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/categorias/` | Listar categorías |
| GET | `/api/recetas/` | Listar recetas (filtros: q, tipo, dificultad) |
| GET | `/api/recetas/<id>/` | Detalle de receta |

### Aprendizaje
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/aprendizaje/` | Listar contenido educativo |
| GET | `/api/aprendizaje/<id>/` | Detalle de contenido |
| GET | `/api/quiz/` | Obtener preguntas aleatorias |
| POST | `/api/quiz/resultado/` | Enviar respuestas y obtener resultado |

### Usuarios (requieren JWT)
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET/PATCH | `/api/usuarios/perfil/` | Ver o actualizar perfil |
| POST | `/api/usuarios/calculadora/` | Calcular nutrición (público también) |
| GET | `/api/usuarios/calculos/` | Historial de cálculos |
| GET/POST | `/api/usuarios/favoritos/` | Recetas favoritas |
| DELETE | `/api/usuarios/favoritos/<id>/` | Eliminar favorito |
| GET | `/api/usuarios/progreso/` | Progreso de aprendizaje |
| GET | `/api/usuarios/logros/` | Logros del usuario |

---

## Ramas de trabajo

| Rama | Propósito |
|------|-----------|
| `main` | Código estable de producción |
| `develop` | Integración y desarrollo activo |

Flujo: `feature/xxx` → `develop` → `main`

---

## Funcionalidades

- 🧮 **Calculadora Nutricional** — Fórmula Harris-Benedict, 5 niveles de actividad, 3 objetivos
- 🍽️ **500+ Recetas** — Categorizadas, con valores nutricionales y tips
- 📚 **Modo Aprendizaje** — Artículos e infografías sobre nutrición (iconos emoji, sin dependencia de Font Awesome)
- 🎯 **Quiz Interactivo** — 10 preguntas aleatorias con puntaje inmediato
- 🏆 **Gamificación** — Puntos, niveles y 10 logros desbloqueables
- 🔒 **Autenticación JWT** — Registro, login y refresh automático de tokens
- 🎮 **ObraFit Rush** — Minijuego runner estilo Subway Surfers dibujado en Canvas 2D: obrero animado con casco y chaleco, edificios de construcción en perspectiva, grúas, obstáculos de obra (conos, barreras, sacos de cemento, tablones)

---

Hecho con ❤️ en Chile 🇨🇱
