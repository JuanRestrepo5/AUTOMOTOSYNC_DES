@echo off
echo ==========================================
echo Compilando AUTOMOTOSYNC...
echo ==========================================

REM 1. Compilar la app web
npm run build
if %errorlevel% neq 0 (
    echo Error al compilar la app web
    pause
    exit /b
)

REM 2. Sincronizar Capacitor
npx cap sync android
if %errorlevel% neq 0 (
    echo Error al sincronizar con Capacitor
    pause
    exit /b
)

REM 3. Generar APK release
cd android
.\gradlew assembleRelease
if %errorlevel% neq 0 (
    echo Error al generar el APK
    pause
    exit /b
)
cd ..

echo ==========================================
echo APK generado en:
echo android\app\build\outputs\apk\release\app-release.apk
echo ==========================================

REM 4. Abrir Android Studio en la carpeta android
echo Abriendo Android Studio...
start "" "C:\Program Files\Android\Android Studio\bin\studio64.exe" android

pause
