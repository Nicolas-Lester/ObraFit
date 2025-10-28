# 🚀 Instrucciones Rápidas para Compañeros de Equipo

## ⚡ Inicio Rápido

### 1️⃣ Clonar el proyecto
```bash
git clone https://github.com/Nicolas-Lester/Develop_ObraFit.git
cd Develop_ObraFit
```

### 2️⃣ Instalar dependencias
```bash
pip install -r requirements.txt
```

### 3️⃣ Configurar PostgreSQL (si usas PostgreSQL)
```sql
CREATE DATABASE obrafit_db ENCODING 'UTF8';
```

Luego edita `ObraFit/settings.py` con tus credenciales.

### 4️⃣ Migrar base de datos
```bash
python manage.py migrate
```

### 5️⃣ Poblar recetas (MUY IMPORTANTE)

**Windows (RECOMENDADO):**
```bash
# Solo doble clic en:
poblar_recetas.bat
```

**PowerShell:**
```powershell
$env:PYTHONIOENCODING='utf-8'; python poblar_db_chile.py
```

**Linux/Mac:**
```bash
PYTHONIOENCODING=utf-8 python poblar_db_chile.py
```

> ⚠️ **MUY IMPORTANTE**: Siempre usar el encoding UTF-8, o verás caracteres raros como `?` o `??`

### 6️⃣ Ejecutar servidor
```bash
python manage.py runserver
```

### 7️⃣ Ver la aplicación
Abre tu navegador en: http://localhost:8000

---

## ❓ Problemas Comunes

### Veo caracteres raros (?, ??)
**Solución:** No poblaste la BD con UTF-8. Ejecuta:
```bash
# Limpiar BD
python manage.py flush --noinput

# Repoblar correctamente
.\poblar_recetas.bat
```

### Error al instalar dependencias
**Solución:** Asegúrate de tener Python 3.12+
```bash
python --version
```

### PostgreSQL no conecta
**Solución:** Verifica credenciales en `ObraFit/settings.py`

---

## 📁 Archivos Importantes

- `poblar_recetas.bat` - Script para poblar BD (USAR SIEMPRE)
- `poblar_db_chile.py` - Script de poblamiento (mejorado con UTF-8)
- `ObraFit/settings.py` - Configuración Django (ya configurado con UTF-8)
- `requirements.txt` - Dependencias del proyecto

## 🆘 ¿Necesitas Ayuda?

Contacta a Nicolas Lester o revisa el README.md completo.
