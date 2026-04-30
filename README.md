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

## Inicio rápido con Docker

```bash
# 1. Clonar el repositorio
git clone https://github.com/Nicolas-Lester/ObraFit.git
cd ObraFit

# 2. Crear el archivo de entorno
cp .env.example .env
# Edita .env con tus valores

# 3. Levantar todos los servicios
docker-compose up --build
```

La aplicación estará disponible en **http://localhost**.

---

## Variables de entorno

| Variable | Descripción | Default (dev) |
|----------|-------------|---------------|
| `SECRET_KEY` | Django secret key | — (requerida) |
| `DJANGO_SETTINGS_MODULE` | Módulo de settings | `config.settings.development` |
| `POSTGRES_DB` | Nombre de la BD | `obrafit_db` |
| `POSTGRES_USER` | Usuario PostgreSQL | `obrafit_user` |
| `POSTGRES_PASSWORD` | Contraseña | — (requerida) |
| `POSTGRES_HOST` | Host PostgreSQL | `db` |
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

## Desarrollo local (sin Docker)

### Backend

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate       # Windows
# source .venv/bin/activate  # Linux/Mac

pip install -r requirements.txt
python manage.py migrate
python manage.py runserver
```

### Poblar base de datos

```bash
python backend/scripts/poblar_db.py
python backend/scripts/crear_logros.py
```

### Frontend

```bash
cd frontend
npm install
npm run dev   # http://localhost:5173
```

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
- 📚 **Modo Aprendizaje** — Artículos e infografías sobre nutrición
- 🎯 **Quiz Interactivo** — 10 preguntas aleatorias con puntaje inmediato
- 🏆 **Gamificación** — Puntos, niveles y 10 logros desbloqueables
- 🔒 **Autenticación JWT** — Registro, login y refresh automático de tokens

---

Hecho con ❤️ en Chile 🇨🇱
