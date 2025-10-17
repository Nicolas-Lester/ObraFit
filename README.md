# 🏗️ ObraFit - Plataforma de Bienestar y Nutrición

![ObraFit](https://img.shields.io/badge/ObraFit-v1.0-blue)
![Django](https://img.shields.io/badge/Django-5.2.7-green)
![TailwindCSS](https://img.shields.io/badge/TailwindCSS-3.4-blue)

## 📋 Descripción

**ObraFit** es una plataforma web integral diseñada específicamente para trabajadores de la construcción, enfocada en mejorar su bienestar y nutrición. La aplicación ofrece herramientas educativas, calculadora nutricional, recetas saludables y seguimiento de progreso.

## ✨ Características Principales

### 🏠 Página de Inicio
- Hero section motivacional con gradientes modernos
- Grid de características con tarjetas interactivas
- Sección de testimonios de usuarios
- Call-to-action atractivo
- Estadísticas y badges de confianza

### 🧮 Calculadora Nutricional
- Formulario interactivo para cálculo de macronutrientes
- Cálculo de TMB (Tasa Metabólica Basal)
- Ajuste según objetivos (perder, mantener, ganar peso)
- Resultados visuales con tarjetas coloridas
- Recomendaciones personalizadas

### 🍽️ Recetas Saludables
- Categorización por tipo de comida
- Filtros y búsqueda
- Valores nutricionales detallados
- Recetas económicas y fáciles de preparar

### 🎓 Modo Aprendizaje
- Contenido educativo interactivo
- Quiz y juegos sobre nutrición
- Tips y consejos diarios
- Progresión gamificada

### 📊 Panel de Progreso
- Seguimiento de objetivos
- Estadísticas visuales
- Sistema de logros y badges
- Historial de evolución

### 📧 Contacto
- Formulario de contacto funcional
- Información de la empresa
- Enlaces a redes sociales
- FAQ y soporte

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
│   ├── settings.py
│   ├── urls.py
│   └── wsgi.py
├── recetas/                  # App principal
│   ├── views.py             # Vistas de las páginas
│   ├── urls.py              # Rutas de la aplicación
│   └── models.py
├── templates/               # Templates HTML
│   ├── base.html           # Template base
│   ├── index.html          # Página de inicio
│   ├── calculadora.html    # Calculadora nutricional
│   ├── recetas.html        # Listado de recetas
│   ├── aprendizaje.html    # Modo aprendizaje
│   ├── progreso.html       # Panel de progreso
│   ├── acerca.html         # Acerca de
│   └── contacto.html       # Contacto
├── static/                  # Archivos estáticos
│   ├── css/
│   │   └── styles.css      # Estilos personalizados
│   └── js/
│       └── scripts.js      # JavaScript personalizado
├── staticfiles/            # Archivos estáticos recolectados
├── manage.py               # CLI de Django
└── requirements.txt        # Dependencias del proyecto
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
python manage.py migrate
```

4. **Recolectar archivos estáticos**
```bash
python manage.py collectstatic --noinput
```

5. **Crear superusuario (opcional)**
```bash
python manage.py createsuperuser
```

6. **Ejecutar el servidor de desarrollo**
```bash
python manage.py runserver
```

7. **Acceder a la aplicación**
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

INSTALLED_APPS = [
    'django.contrib.admin',
    'django.contrib.auth',
    'django.contrib.contenttypes',
    'django.contrib.sessions',
    'django.contrib.messages',
    'django.contrib.staticfiles',
    'recetas',  # App principal
]

STATIC_URL = '/static/'
STATICFILES_DIRS = [BASE_DIR / 'static']
STATIC_ROOT = BASE_DIR / 'staticfiles'
```

## 🌐 Rutas Disponibles

| Ruta | Vista | Descripción |
|------|-------|-------------|
| `/` | `home` | Página de inicio |
| `/calculadora/` | `calculadora` | Calculadora nutricional |
| `/recetas/` | `recetas` | Listado de recetas |
| `/aprendizaje/` | `aprendizaje` | Modo aprendizaje |
| `/progreso/` | `progreso` | Panel de progreso |
| `/acerca/` | `acerca` | Acerca de ObraFit |
| `/contacto/` | `contacto` | Formulario de contacto |

## 🎯 Funcionalidades JavaScript

### Navbar
- Menu responsive con toggle
- Efecto scroll con sombra
- Smooth scroll para enlaces internos
- Active state para página actual

### Calculadora
- Validación de formularios en tiempo real
- Cálculo automático de macronutrientes
- Fórmula Harris-Benedict para TMB
- Resultados dinámicos y animados

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

- [ ] Sistema de autenticación de usuarios
- [ ] Dashboard personalizado
- [ ] Base de datos de recetas completa
- [ ] Sistema de favoritos
- [ ] Compartir en redes sociales
- [ ] Export de plan nutricional PDF
- [ ] Integración con wearables
- [ ] App móvil nativa
- [ ] Sistema de comunidad/foro
- [ ] Notificaciones push

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

## 📞 Contacto

- Email: contacto@obrafit.com
- Website: [obrafit.com](https://obrafit.com)
- GitHub: [@Nicolas-Lester](https://github.com/Nicolas-Lester)

## 🙏 Agradecimientos

- A todos los trabajadores de la construcción que inspiraron este proyecto
- A la comunidad de Django por el excelente framework
- A Tailwind CSS por facilitar el desarrollo del diseño

---

Hecho con ❤️ para mejorar el bienestar de los trabajadores de la construcción.
