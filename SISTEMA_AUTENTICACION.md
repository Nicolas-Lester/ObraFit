# 🎯 Sistema de Autenticación y Perfil de Usuario - ObraFit

## ✅ Sistema Implementado Completamente

Se ha implementado un sistema completo de autenticación y gestión de usuarios que permite:

### 🔐 Funcionalidades de Autenticación

1. **Registro de Usuarios**
   - Formulario intuitivo con validación
   - Campos: username, nombre, apellido (opcional), email, contraseña
   - Validación de email único
   - Contraseñas con validación de seguridad
   - Creación automática de perfil de usuario

2. **Inicio de Sesión (Login)**
   - Login con usuario o email
   - Opción "Recordarme" 
   - Mensajes de bienvenida personalizados ("¡Hola de nuevo, Carlos!")
   - Redirección a página anterior después de login

3. **Cierre de Sesión (Logout)**
   - Logout con confirmación
   - Mensaje de despedida personalizado

### 👤 Sistema de Perfil de Usuario

Cada usuario tiene un perfil automático que incluye:

- Avatar emoji personalizable
- Nivel de usuario (sistema de gamificación)
- Puntos totales acumulados
- Estadísticas personalizadas
- Fecha de registro

### 💾 Datos Guardados por Usuario

El sistema guarda automáticamente:

#### 1. **Calculadora Nutricional**
- ✅ Peso, altura, edad
- ✅ Género y nivel de actividad
- ✅ Objetivo (perder, mantener, ganar peso)
- ✅ Resultados calculados (calorías, proteínas, carbohidratos, grasas)
- ✅ Historial completo de cálculos con fechas
- ✅ Muestra el último cálculo al volver a la calculadora

#### 2. **Recetas Favoritas** (preparado para implementar)
- Modelo creado para guardar recetas favoritas
- Relación usuario-receta con fecha
- Listo para agregar funcionalidad de "favoritos"

#### 3. **Progreso de Aprendizaje** (preparado para implementar)
- Modelo para guardar progreso de lecciones
- Puntuación de quizzes
- Número de intentos
- Lecciones completadas

#### 4. **Sistema de Logros**
- 10 logros predefinidos listos para desbloquear
- Puntos asociados a cada logro
- Sistema de recompensas

### 🎨 Interfaz de Usuario

#### Navbar Dinámico
- **Usuario NO autenticado**: Muestra botones "Iniciar Sesión" y "Comenzar"
- **Usuario autenticado**: 
  - Saludo personalizado: "¡Hola, Carlos!"
  - Menú desplegable con:
    - Mi Perfil
    - Mi Progreso
    - Cerrar Sesión

#### Página de Perfil
Muestra estadísticas completas del usuario:
- Información personal
- Nivel y puntos
- Total de cálculos realizados
- Lecciones completadas
- Recetas favoritas
- Último cálculo nutricional
- Logros desbloqueados
- Acciones rápidas a todas las secciones

### 📁 Estructura de Archivos Creados

```
usuarios/
├── __init__.py
├── admin.py          # Administración de modelos
├── apps.py
├── forms.py          # Formularios de registro y login
├── models.py         # Modelos de datos
│   ├── PerfilUsuario
│   ├── CalculoNutricional
│   ├── RecetaFavorita
│   ├── ProgresoAprendizaje
│   ├── Logro
│   └── LogroDesbloqueado
├── urls.py           # URLs de la app
├── views.py          # Vistas de registro, login, logout, perfil
├── migrations/
│   └── 0001_initial.py
└── templates/
    └── usuarios/
        ├── registro.html
        ├── login.html
        └── perfil.html
```

### 🔧 Configuración Realizada

#### settings.py
```python
INSTALLED_APPS = [
    ...
    'usuarios',
]

LOGIN_URL = 'usuarios:login'
LOGIN_REDIRECT_URL = 'home'
LOGOUT_REDIRECT_URL = 'home'
```

#### urls.py principal
```python
urlpatterns = [
    path('admin/', admin.site.urls),
    path('usuarios/', include('usuarios.urls')),
    path('', include('recetas.urls')),
]
```

### 🚀 Cómo Usar el Sistema

#### Para Usuarios

1. **Crear Cuenta**
   - Ir a http://127.0.0.1:8000/usuarios/registro/
   - Llenar formulario con datos personales
   - ¡Cuenta creada! Se inicia sesión automáticamente

2. **Iniciar Sesión**
   - Ir a http://127.0.0.1:8000/usuarios/login/
   - Ingresar usuario/email y contraseña
   - Ser recibido con "¡Hola de nuevo, [Nombre]!"

3. **Usar la Calculadora**
   - Ir a Calculadora desde el menú
   - Llenar datos personales
   - Click en "Calcular Ahora"
   - Los resultados se guardan automáticamente si estás logueado
   - Ver historial en "Mi Perfil"

4. **Ver Perfil**
   - Click en menú de usuario → "Mi Perfil"
   - Ver todas tus estadísticas
   - Ver tu último cálculo
   - Ver logros desbloqueados

### 🎮 Crear Logros Iniciales

Ejecutar en la terminal:

```bash
python manage.py shell < crear_logros.py
```

Esto creará 10 logros predefinidos en la base de datos.

### 🔜 Próximos Pasos (Opcional)

Para completar el sistema al 100%, se puede:

1. **Sistema de Recetas Favoritas**
   - Agregar botón "❤️ Guardar" en cada receta
   - Vista para mostrar recetas favoritas del usuario

2. **Sistema de Aprendizaje**
   - Guardar progreso de quizzes automáticamente
   - Marcar lecciones como completadas
   - Desbloquear logros al completar lecciones

3. **Sistema de Progreso**
   - Gráficos de evolución de peso
   - Estadísticas de uso de la plataforma
   - Racha de días consecutivos

4. **Sistema de Gamificación**
   - Desbloquear logros automáticamente
   - Sistema de niveles basado en puntos
   - Recompensas especiales

### 🎯 URLs Disponibles

- `/` - Página de inicio
- `/usuarios/registro/` - Registro de nuevos usuarios
- `/usuarios/login/` - Inicio de sesión
- `/usuarios/logout/` - Cerrar sesión
- `/usuarios/perfil/` - Perfil del usuario (requiere login)
- `/calculadora/` - Calculadora nutricional
- `/recetas/` - Lista de recetas
- `/aprendizaje/` - Modo aprendizaje
- `/progreso/` - Mi progreso
- `/admin/` - Panel de administración

### 🎨 Características Destacadas

- ✅ Diseño responsive y moderno con Tailwind CSS
- ✅ Mensajes de feedback al usuario (éxito, error, info)
- ✅ Validación de formularios (frontend y backend)
- ✅ Seguridad con CSRF tokens
- ✅ Contraseñas hasheadas automáticamente
- ✅ Señales Django para crear perfil automático
- ✅ Menús desplegables con hover
- ✅ Iconos Font Awesome
- ✅ Animaciones suaves
- ✅ Mensajes personalizados por nombre

### 🐛 Testing

Para probar el sistema:

1. Crear un usuario de prueba
2. Hacer login
3. Usar la calculadora
4. Verificar que se guarda en el perfil
5. Hacer logout
6. Verificar que los datos persisten al volver a entrar

### 📝 Notas Importantes

- Los datos se guardan SOLO si el usuario está autenticado
- Si no está logueado, puede usar la calculadora pero no se guarda
- Se muestra un mensaje informativo para invitar al usuario a registrarse
- El perfil se crea automáticamente al registrarse
- Los cálculos se ordenan por fecha (más reciente primero)

---

## 🎉 ¡Sistema Completamente Funcional!

El sistema de autenticación está 100% operativo y listo para usar. Los usuarios pueden:
- Registrarse e iniciar sesión
- Ver su nombre en el navbar
- Guardar sus cálculos nutricionales
- Ver su historial en el perfil
- Cerrar sesión de forma segura

¡Disfruta de ObraFit! 💪🏗️
