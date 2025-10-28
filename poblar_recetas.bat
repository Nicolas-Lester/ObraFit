@echo off
chcp 65001 >nul
set PYTHONIOENCODING=utf-8
echo.
echo ====================================
echo   Poblando Base de Datos - ObraFit
echo ====================================
echo.
python poblar_db_chile.py
echo.
pause
