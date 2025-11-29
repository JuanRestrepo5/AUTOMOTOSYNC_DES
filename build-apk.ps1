#!/usr/bin/env powershell
# Script para compilar APK con Java 21
# Uso: .\build-apk.ps1 -type debug   (o 'release')

param(
    [string]$type = "debug"
)

Write-Host "=== AUTOMOTOSYNC APK Builder ===" -ForegroundColor Cyan
Write-Host "Verificando requisitos..." -ForegroundColor Yellow

# Verificar si Java 21 está instalado
$javaPath = "C:\Program Files\Eclipse Adoptium\jdk-21\bin\java.exe"
if (-not (Test-Path $javaPath)) {
    Write-Host "❌ Java 21 no encontrado en: $javaPath" -ForegroundColor Red
    Write-Host "Por favor descarga Java 21 desde: https://adoptium.net/" -ForegroundColor Yellow
    exit 1
}

Write-Host "✅ Java 21 encontrado" -ForegroundColor Green

# Configurar JAVA_HOME
$env:JAVA_HOME = "C:\Program Files\Eclipse Adoptium\jdk-21"
Write-Host "✅ JAVA_HOME configurado: $env:JAVA_HOME" -ForegroundColor Green

# Navegar al directorio android
cd "C:\Users\USUARIO\AUTOMOTOSYNC_DES\android"

# Compilar
Write-Host "`n🔨 Compilando APK de $type..." -ForegroundColor Yellow
Write-Host "Esto puede tomar 2-5 minutos..." -ForegroundColor Yellow

if ($type -eq "release") {
    .\gradlew.bat assembleRelease
    $apkPath = "app\build\outputs\apk\release\app-release.apk"
} else {
    .\gradlew.bat assembleDebug
    $apkPath = "app\build\outputs\apk\debug\app-debug.apk"
}

if ($LASTEXITCODE -eq 0) {
    Write-Host "`n✅ ¡Compilación exitosa!" -ForegroundColor Green
    Write-Host "APK generado en: $apkPath" -ForegroundColor Green
    
    if (Test-Path $apkPath) {
        $size = (Get-Item $apkPath).Length / 1MB
        Write-Host "Tamaño: $([Math]::Round($size, 2)) MB" -ForegroundColor Green
    }
} else {
    Write-Host "`n❌ Error en la compilación" -ForegroundColor Red
    exit 1
}
