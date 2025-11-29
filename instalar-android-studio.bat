@echo off
REM Script para descargar e instalar Android Studio
REM Requiere conexión a internet

color 0A
title AUTOMOTOSYNC - Instalador Android Studio

echo.
echo ========================================
echo   INSTALADOR ANDROID STUDIO
echo ========================================
echo.
echo Este script descargará Android Studio 2024.2.1.11
echo Asegúrate de tener al menos 5 GB libres en el disco
echo.
pause

echo.
echo [1/4] Descargando Android Studio...
echo Esto puede tomar 5-10 minutos (1.5 GB)...

REM Descargar Android Studio
bitsadmin /transfer "AndroidStudio" /download /resume ^
  "https://redirector.gstatic.com/android/studio/install/2024.2.1.11/android-studio-2024.2.1.11-windows.exe" ^
  "%USERPROFILE%\Downloads\android-studio-installer.exe"

if %ERRORLEVEL% neq 0 (
    echo.
    echo [ERROR] No se pudo descargar Android Studio
    echo Descárgalo manualmente desde: https://developer.android.com/studio
    pause
    exit /b 1
)

echo [OK] Descarga completada
echo.
echo [2/4] Instalando Android Studio...
echo Por favor, sigue los pasos del instalador
pause

REM Ejecutar instalador
start "" "%USERPROFILE%\Downloads\android-studio-installer.exe"

echo.
echo [3/4] Esperando a que termine la instalación...
echo Cuando termine, presiona cualquier tecla
pause

echo.
echo [4/4] Abriendo Android Studio...
echo Selecciona: File ^> Open ^> C:\Users\USUARIO\AUTOMOTOSYNC_DES\android

REM Abrir Android Studio
start "" "C:\Program Files\Android\Android Studio\bin\studio64.exe"

echo.
echo [LISTO] Android Studio se está abriendo
echo.
echo Próximos pasos:
echo 1. Espera a que Android Studio abra completamente (1-2 min)
echo 2. Click: File ^> Open
echo 3. Selecciona: C:\Users\USUARIO\AUTOMOTOSYNC_DES\android
echo 4. Espera a que sincronice (2-5 min)
echo 5. Click: Build ^> Build APK(s)
echo 6. ¡Listo! El APK estará en app\build\outputs\apk\debug\
echo.
pause
