# 🏗️ ObraFit - Plataforma de Bienestar y Nutrición

![ObraFit](https://img.shields.io/badge/ObraFit-v2.0-blue)
![Django](https://img.shields.io/badge/Django-5.2.7-green)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-blue)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Latest-blue)

## 📋 Descripción

**ObraFit** es una plataforma web integral de bienestar y nutrición con un completo **sistema de autenticación y gamificación**. Ofrece herramientas educativas, calculadora nutricional, recetas saludables, quizzes interactivos y seguimiento personalizado de progreso con sistema de puntos y logros.

## ✨ Características Principales

### 🔐 **Sistema de Autenticación (NUEVO)**
- ✅ **Registro de usuarios** con validación completa
- ✅ **Login/Logout** con mensajes personalizados
- ✅ **Perfiles de usuario** con avatar, nivel y puntos
- ✅ **Navbar dinámico** que muestra "¡Hola, [Nombre]!"
- ✅ **Persistencia de datos** por usuario
- ✅ **Sistema de sesiones** seguras con Django

### 👤 **Perfiles Personalizados (NUEVO)**
- ✅ Información del usuario (nombre, email, fecha de registro)
- ✅ Sistema de **niveles y puntos** gamificados
- ✅ Avatar personalizable con emojis
- ✅ Estadísticas completas del usuario
- ✅ Historial de todas las actividades
- ✅ Vista de logros desbloqueados

### 🧮 **Calculadora Nutricional Mejorada**
- ✅ Cálculo de TMB (Tasa Metabólica Basal) con fórmula Harris-Benedict
- ✅ **Guardado automático** de cálculos (si estás logueado)
- ✅ **Historial completo** de todos tus cálculos
- ✅ Visualización del último cálculo en el perfil
- ✅ Ajuste según objetivos (perder, mantener, ganar peso)
- ✅ Recomendaciones personalizadas por objetivo
- ✅ Resultados visuales con 4 macronutrientes

### 🎯 **Sistema de Quizzes Interactivos (NUEVO)**
- ✅ Quizzes de nutrición con 10 preguntas
- ✅ **Guardado automático** de progreso y puntuación
- ✅ **Otorga puntos** según desempeño (10 puntos por cada 10%)
- ✅ **Desbloquea logros** si sacas más del 80%
- ✅ Contador de intentos por quiz
- ✅ Se guarda tu mejor puntuación
- ✅ Página de resultados con diseño motivacional
- ✅ Mensajes personalizados según puntuación

### � **Sistema de Logros y Gamificación (NUEVO)**
- ✅ 10+ logros predefinidos para desbloquear
- ✅ Sistema de puntos acumulativos
- ✅ Niveles de usuario basados en puntos
- ✅ Badges visuales en el perfil
- ✅ Logros por:
  - Primer cálculo nutricional
  - Completar quizzes
  - Días consecutivos de uso
  - Recetas favoritas guardadas
  - Y más...

### 🍽️ **Recetas Saludables**
- Más de 500 recetas chilenas saludables
- Categorización por tipo de comida (desayuno, almuerzo, cena, colación)
- Filtros avanzados y búsqueda
- Valores nutricionales completos
- **Sistema de favoritos** (modelo listo para implementar)
- Recetas económicas y fáciles de preparar
- Ingredientes locales y accesibles

### � **Panel de Progreso Personalizado (NUEVO)**
- Estadísticas del usuario en tiempo real
- Gráficos de evolución (próximamente)
- Resumen de actividad
- Logros desbloqueados
- Quizzes completados
- Cálculos realizados
- Nivel y puntos actuales

## 🛠️ Tecnologías Utilizadas

### Backend
- **Django 5.2.7** - Framework web de Python
- **Python 3.12+** - Lenguaje de programación

### Frontend
- **TailwindCSS 3.4** - Framework CSS utility-first
- **JavaScript Vanilla** - Para interactividad
- **Font Awesome 6.5** - Iconografía
- **Google Fonts** - Tipografías (Inter & Nunito)

### Diseño
- Diseño responsive (Mobile-first)
- Paleta de colores: Primary (Azul), Mint (Verde Agua), Warm (Cálido)
- Animaciones CSS y JS personalizadas
- Componentes modulares y reutilizables

## 📁 Estructura del Proyecto

```
Develop_ObraFit/
├── ObraFit/                  # Configuración principal de Django
│   ├── settings.py          # 🆕 Configuración con app 'usuarios'
│   ├── urls.py              # 🆕 Rutas principales + usuarios
│   └── wsgi.py
├── usuarios/                 # 🆕 App de autenticación (NUEVA)
│   ├── models.py            # 🆕 6 modelos: PerfilUsuario, CalculoNutricional, etc.
│   ├── views.py             # 🆕 registro, login, logout, perfil
│   ├── forms.py             # 🆕 RegistroForm, LoginForm
│   ├── urls.py              # 🆕 Rutas de autenticación
│   ├── admin.py             # 🆕 Panel admin para usuarios
│   └── templates/
│       └── usuarios/
│           ├── registro.html
│           ├── login.html
│           └── perfil.html
├── recetas/                  # App principal
│   ├── views.py             # 🆕 Vistas + calculadora + quizzes con persistencia
│   ├── urls.py              # Rutas de la aplicación
│   └── models.py            # Modelo de Recetas
├── aprendizaje/             # 🆕 App de quizzes
│   └── templates/
│       └── aprendizaje/
│           ├── quiz.html         # 🆕 Reescrito con HTML forms
│           └── quiz_resultado.html # 🆕 Página de resultados
├── templates/               # Templates globales
│   ├── base.html           # 🆕 Template base con navbar dinámico
│   ├── index.html          # 🆕 Generalizado (sin "Constructores")
│   ├── calculadora.html    # 🆕 Con persistencia de datos
│   ├── recetas.html        # Listado de recetas
│   ├── aprendizaje.html    # Modo aprendizaje
│   ├── progreso.html       # Panel de progreso
│   ├── acerca.html         # Acerca de
│   ├── contacto.html       # Contacto
│   └── includes/
│       ├── navbar.html     # 🆕 Con menú de usuario
│       └── footer.html
├── static/                  # Archivos estáticos
│   ├── css/
│   │   ├── base.css
│   │   ├── main.css
│   │   └── components/     # CSS modular
│   └── js/
│       ├── main.js
│       └── scripts.js
├── staticfiles/            # Archivos estáticos recolectados
├── db.sqlite3              # Base de datos SQLite (desarrollo)
├── manage.py               # CLI de Django
├── poblar_db_chile.py      # Script de población de recetas
├── crear_logros.py         # 🆕 Script para crear logros iniciales
├── requirements.txt        # Dependencias del proyecto
├── SISTEMA_AUTENTICACION.md # 🆕 Documentación técnica
└── COMO_USAR_AUTH.md       # 🆕 Guía de uso
```

## 🚀 Instalación y Configuración

### Prerrequisitos
- Python 3.12 o superior
- pip (gestor de paquetes de Python)
- Git

### Pasos de Instalación

1. **Clonar el repositorio**
```bash
git clone https://github.com/Nicolas-Lester/Develop_ObraFit.git
cd Develop_ObraFit
```

2. **Instalar dependencias**
```bash
pip install -r requirements.txt
```

3. **Realizar migraciones**
```bash
python manage.py makemigrations
python manage.py migrate
```

> 🆕 **IMPORTANTE**: Si ya tenías la base de datos, necesitas migrar la nueva app `usuarios`:
> ```bash
> python manage.py makemigrations usuarios
> python manage.py migrate usuarios
> ```

4. **Recolectar archivos estáticos**
```bash
python manage.py collectstatic --noinput
```

5. **Poblar la base de datos con recetas**

**Windows (Recomendado):**
```bash
# Doble clic en el archivo:
poblar_recetas.bat

# O desde PowerShell:
.\poblar_recetas.bat
```

**Alternativa manual (PowerShell):**
```powershell
$env:PYTHONIOENCODING='utf-8'; python poblar_db_chile.py
```

**Linux/Mac:**
```bash
PYTHONIOENCODING=utf-8 python poblar_db_chile.py
```

> ⚠️ **IMPORTANTE**: Siempre usar UTF-8 para que los acentos y ñ se vean correctamente.

6. **Crear superusuario (opcional)**
```bash
python manage.py createsuperuser
```

7. **🆕 Crear logros iniciales (NUEVO)**
```bash
python crear_logros.py
```

> Esto crea 10+ logros predefinidos como "Primera Calculación", "Experto en Nutrición", etc.

8. **Ejecutar el servidor de desarrollo**
```bash
python manage.py runserver
```

9. **Acceder a la aplicación**
```
http://localhost:8000
```

## 🎨 Paleta de Colores

| Color | Hex | Uso |
|-------|-----|-----|
| Primary 500 | `#0ea5e9` | Elementos principales, botones |
| Mint 500 | `#14b8a6` | Acentos, hover states |
| Warm 900 | `#1c1917` | Textos principales |
| Warm 50 | `#fafaf9` | Fondos claros |
| Yellow 500 | `#f59e0b` | Alertas, badges |
| Green 500 | `#22c55e` | Éxitos, confirmaciones |
| Red 500 | `#ef4444` | Errores, advertencias |

## 📱 Responsive Design

La aplicación está completamente optimizada para:
- 📱 **Mobile** (320px - 767px)
- 📱 **Tablet** (768px - 1023px)
- 💻 **Desktop** (1024px+)
- 🖥️ **Wide Desktop** (1440px+)

## 🔧 Configuración de Django

### Settings Importantes

```python
# settings.py

# Configuración UTF-8 (IMPORTANTE para caracteres especiales)
import os
os.environ.setdefault('PYTHONIOENCODING', 'utf-8')

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'recetas',  # App principal
    'usuarios',  # 🆕 App de autenticación (NUEVO)
]

# 🆕 Configuración de autenticación (NUEVO)
LOGIN_URL = '/usuarios/login/'
LOGIN_REDIRECT_URL = '/'
LOGOUT_REDIRECT_URL = '/'

AUTH_USER_MODEL = 'auth.User'  # Modelo de usuario estándar de Django

STATIC_URL = '/static/'
STATICFILES_DIRS = [BASE_DIR / 'static']
STATIC_ROOT = BASE_DIR / 'staticfiles'

# Configuración para PostgreSQL con UTF-8
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'OPTIONS': {
            'client_encoding': 'UTF8',
        },
    }
}

# Encoding
DEFAULT_CHARSET = 'utf-8'
FILE_CHARSET = 'utf-8'
```

### ⚠️ Nota Importante sobre Encoding

Este proyecto usa **UTF-8** para soportar correctamente caracteres especiales del español (á, é, í, ó, ú, ñ). 

**Al poblar la base de datos:**
- ✅ Usar `poblar_recetas.bat` (Windows)
- ✅ O configurar `PYTHONIOENCODING=utf-8` manualmente
- ❌ NO ejecutar directamente `python poblar_db_chile.py` sin la variable de entorno

Si ves caracteres como `?` o `??`, significa que falta la configuración UTF-8.

## 🌐 Rutas Disponibles

### Rutas Públicas
| Ruta | Vista | Descripción |
|------|-------|-------------|
| `/` | `home` | Página de inicio |
| `/calculadora/` | `calculadora` | Calculadora nutricional (guarda datos si estás logueado) |
| `/recetas/` | `recetas` | Listado de recetas |
| `/aprendizaje/` | `aprendizaje` | Modo aprendizaje |
| `/aprendizaje/quiz/` | `quiz` | Quiz interactivo (guarda progreso si estás logueado) |
| `/progreso/` | `progreso` | Panel de progreso |
| `/acerca/` | `acerca` | Acerca de ObraFit |
| `/contacto/` | `contacto` | Formulario de contacto |

### 🆕 Rutas de Autenticación (NUEVO)
| Ruta | Vista | Descripción | Requiere Login |
|------|-------|-------------|----------------|
| `/usuarios/registro/` | `registro_view` | Formulario de registro | ❌ No |
| `/usuarios/login/` | `login_view` | Formulario de login | ❌ No |
| `/usuarios/logout/` | `logout_view` | Cerrar sesión | ✅ Sí |
| `/usuarios/perfil/` | `perfil_view` | Perfil del usuario con estadísticas | ✅ Sí |

## 🗄️ Modelos de Base de Datos (NUEVO)

### PerfilUsuario
Extiende el modelo User de Django con información adicional:
```python
{
    'user': User,              # Usuario Django (OneToOne)
    'avatar': str,             # Emoji del avatar
    'puntos': int,             # Puntos acumulados
    'nivel': int,              # Nivel del usuario (calculado por puntos)
    'fecha_registro': datetime # Fecha de creación automática
}
```

### CalculoNutricional
Guarda todos los cálculos de la calculadora:
```python
{
    'usuario': User,           # Usuario que hizo el cálculo
    'edad': int,
    'peso': float,
    'altura': float,
    'genero': str,             # 'M' o 'F'
    'nivel_actividad': str,
    'objetivo': str,           # 'perder', 'mantener', 'ganar'
    'tmb': float,              # Tasa metabólica basal calculada
    'calorias_diarias': float, # Calorías recomendadas
    'fecha': datetime          # Fecha del cálculo
}
```

### ProgresoAprendizaje
Registra el progreso en quizzes:
```python
{
    'usuario': User,
    'titulo_quiz': str,        # Título del quiz
    'puntuacion': float,       # Porcentaje (0-100)
    'intentos': int,           # Contador de intentos
    'completado': bool,        # Si aprobó (>60%)
    'fecha': datetime
}
```

### Logro
Logros disponibles en el sistema:
```python
{
    'nombre': str,             # "Primera Calculación"
    'descripcion': str,
    'icono': str,              # Emoji del logro
    'puntos_requeridos': int,  # Puntos para desbloquearlo
    'tipo': str                # 'calculadora', 'quiz', 'receta', etc.
}
```

### LogroDesbloqueado
Relación de logros desbloqueados por usuario:
```python
{
    'usuario': User,
    'logro': Logro,
    'fecha_desbloqueo': datetime
}
```

### RecetaFavorita
Recetas guardadas como favoritas (funcionalidad lista para implementar):
```python
{
    'usuario': User,
    'receta': Receta,
    'fecha_agregado': datetime
}
```

## 🎯 Funcionalidades JavaScript

### 🆕 Sistema de Autenticación
- **Registro**: Validación de contraseñas en tiempo real
- **Login**: Soporte para username o email
- **Navbar Dinámico**: Muestra "¡Hola, [Nombre]!" cuando estás logueado
- **Dropdown Menu**: Menú desplegable con perfil y logout
- **Mensajes Flash**: Notificaciones de éxito/error en acciones

### Navbar
- Menu responsive con toggle
- Efecto scroll con sombra
- Smooth scroll para enlaces internos
- Active state para página actual
- 🆕 Menú de usuario con hover effect

### Calculadora
- 🆕 **Guardado Automático**: Si estás logueado, se guardan todos tus cálculos
- Validación de formularios en tiempo real
- Cálculo automático de macronutrientes
- Fórmula Harris-Benedict para TMB
- Resultados dinámicos y animados
- 🆕 **Historial**: Ver todos tus cálculos en tu perfil

### 🆕 Sistema de Quizzes
- **Procesamiento Backend**: Las respuestas se envían al servidor
- **Puntuación Automática**: Calcula tu porcentaje de aciertos
- **Sistema de Puntos**: Ganas 10 puntos por cada 10% de acierto
- **Desbloqueo de Logros**: Si sacas >80%, desbloqueas logro
- **Persistencia**: Se guarda tu mejor puntuación y número de intentos
- **Página de Resultados**: Feedback motivacional según tu desempeño

### Animaciones
- Fade-in al hacer scroll
- Hover effects en tarjetas
- Transiciones suaves
- Loading spinners

### Notificaciones
- Sistema de alertas (success, error, warning, info)
- Auto-dismiss después de 5 segundos
- Posición personalizable

## 📝 Próximas Funcionalidades

- [x] ✅ Sistema de autenticación de usuarios (COMPLETADO)
- [x] ✅ Dashboard personalizado con estadísticas (COMPLETADO)
- [x] ✅ Sistema de puntos y logros (COMPLETADO)
- [x] ✅ Guardado de progreso en quizzes (COMPLETADO)
- [x] ✅ Guardado de cálculos nutricionales (COMPLETADO)
- [ ] Sistema de favoritos para recetas (modelo listo)
- [ ] Base de datos de recetas completa (500+ recetas)
- [ ] Compartir en redes sociales
- [ ] Export de plan nutricional PDF
- [ ] Gráficos de evolución en perfil
- [ ] Sistema de racha (días consecutivos)
- [ ] Notificaciones en la app
- [ ] Integración con wearables
- [ ] App móvil nativa
- [ ] Sistema de comunidad/foro

## 📚 Guía de Uso del Sistema de Autenticación

### 1️⃣ Registrarse
1. Ve a la página de **Registro** (botón en el navbar o `/usuarios/registro/`)
2. Completa el formulario:
   - Nombre de usuario (único)
   - Email (único)
   - Contraseña (mínimo 8 caracteres)
   - Confirmar contraseña
3. Al registrarte, se crea automáticamente tu perfil con:
   - **0 puntos**
   - **Nivel 1**
   - **Avatar aleatorio** 😊
4. Serás redirigido al inicio con mensaje "¡Bienvenido a ObraFit!"

### 2️⃣ Iniciar Sesión
1. Ve a **Login** (botón en el navbar o `/usuarios/login/`)
2. Ingresa tu **username** o **email**
3. Ingresa tu contraseña
4. El navbar mostrará "¡Hola, [Tu Nombre]!" 👋

### 3️⃣ Usar la Calculadora
1. Ve a la **Calculadora Nutricional**
2. Ingresa tus datos (edad, peso, altura, etc.)
3. Haz clic en "Calcular"
4. Si estás logueado, el cálculo se guarda automáticamente
5. Puedes ver todos tus cálculos en tu **Perfil**

### 4️⃣ Hacer Quizzes
1. Ve a **Aprendizaje** → **Tomar Quiz**
2. Responde las 10 preguntas
3. Al enviar, se calcula tu puntuación automáticamente
4. **Ganas puntos**: 10 puntos por cada 10% de acierto
   - 100% = 100 puntos 🏆
   - 80% = 80 puntos ⭐
   - 50% = 50 puntos 👍
5. Si sacas **más del 80%**, desbloqueas el logro "Experto en Nutrición"
6. Puedes volver a intentarlo para mejorar tu puntuación

### 5️⃣ Ver tu Perfil
1. Haz clic en tu nombre en el navbar → **Ver Perfil**
2. En tu perfil verás:
   - **Información personal**: nombre, email, fecha de registro
   - **Nivel y Puntos**: basados en tu actividad
   - **Estadísticas**:
     - Total de cálculos realizados
     - Total de quizzes completados
     - Logros desbloqueados
   - **Último Cálculo**: resultados de tu última calculadora
   - **Logros**: badges de los logros que has desbloqueado

### 6️⃣ Sistema de Niveles
Los niveles se calculan automáticamente según tus puntos:
- **Nivel 1**: 0-99 puntos
- **Nivel 2**: 100-249 puntos
- **Nivel 3**: 250-499 puntos
- **Nivel 4**: 500-999 puntos
- **Nivel 5**: 1000+ puntos

### 7️⃣ Cerrar Sesión
1. Haz clic en tu nombre en el navbar
2. Selecciona **Cerrar Sesión**
3. Serás redirigido al inicio con mensaje "¡Hasta pronto!"

## 🔒 Seguridad

- ✅ Contraseñas hasheadas con algoritmo PBKDF2
- ✅ Validación de formularios en backend y frontend
- ✅ Protección CSRF en todos los formularios
- ✅ Sesiones seguras con Django
- ✅ Validación de email único
- ✅ Validación de username único
- ✅ Requisitos mínimos de contraseña

## 📖 Documentación Adicional

Para más información técnica sobre el sistema de autenticación:
- **SISTEMA_AUTENTICACION.md** - Documentación técnica completa
- **COMO_USAR_AUTH.md** - Guía de usuario detallada

## 🐛 Troubleshooting

### Problema: "No se guardan mis cálculos"
**Solución**: Asegúrate de estar logueado antes de usar la calculadora.

### Problema: "No veo mi puntuación del quiz"
**Solución**: Verifica que estés logueado y que hayas enviado el formulario completo.

### Problema: "Error al registrarme"
**Solución**: Verifica que:
- El username no esté en uso
- El email no esté registrado
- Las contraseñas coincidan
- La contraseña tenga al menos 8 caracteres

### Problema: "Caracteres raros en las recetas (�, ??)"
**Solución**: Asegúrate de poblar la BD con:
```bash
.\poblar_recetas.bat  # En Windows
```
O configura `PYTHONIOENCODING=utf-8` antes de ejecutar el script.

## 🤝 Contribuir

Las contribuciones son bienvenidas. Para contribuir:

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver archivo `LICENSE` para más detalles.

## 👥 Autores

- **Nicolas Lester** - *Desarrollo Inicial* - [@Nicolas-Lester](https://github.com/Nicolas-Lester)

## 🆕 Changelog (v2.0)

### ✨ Nuevas Funcionalidades
- ✅ **Sistema completo de autenticación** (registro, login, logout)
- ✅ **Perfiles de usuario** con avatar, nivel y puntos
- ✅ **Sistema de gamificación** con 10+ logros desbloqueables
- ✅ **Persistencia de datos** para cálculos nutricionales
- ✅ **Sistema de quizzes** con guardado automático y puntuación
- ✅ **Navbar dinámico** que muestra el nombre del usuario
- ✅ **Panel de estadísticas** en el perfil
- ✅ **Sistema de puntos** que otorga XP por actividades

### 🔧 Mejoras
- ✅ Generalización de contenido (eliminada mención específica a "Constructores")
- ✅ Calculadora ahora guarda historial completo
- ✅ Quizzes reescritos con HTML forms (más confiable)
- ✅ Mejor espaciado en navbar
- ✅ Mensajes flash mejorados
- ✅ Validación de formularios mejorada

### 🐛 Correcciones
- ✅ Arreglado error de URL 'index' vs 'home'
- ✅ Calculadora ahora envía formulario correctamente
- ✅ Quizzes ahora persisten correctamente en base de datos
- ✅ Navbar con mejor responsive design

## 📞 Contacto

- Email: contacto@obrafit.com
- Website: [obrafit.com](https://obrafit.com)
- GitHub: [@Nicolas-Lester](https://github.com/Nicolas-Lester)

## 🙏 Agradecimientos

- A todos los trabajadores de la construcción que inspiraron este proyecto
- A la comunidad de Django por el excelente framework
- A Tailwind CSS por facilitar el desarrollo del diseño

---

**ObraFit v2.0** - Hecho con ❤️ para promover el bienestar y la nutrición saludable.

🆕 **Ahora con sistema completo de autenticación, gamificación y persistencia de datos!**
