# 🚀 GENERAR APK - INSTRUCCIONES RÁPIDAS

## 📱 OPCIÓN 1: Android Studio (RECOMENDADO - MÁS FÁCIL)

```
1. Descarga Android Studio: https://developer.android.com/studio
2. Abre Android Studio
3. File → Open → C:\Users\USUARIO\AUTOMOTOSYNC_DES\android
4. Espera a que sincronice (2-5 minutos)
5. Build → Build Bundle(s) / APK(s) → Build APK(s)
6. ¡Listo! El APK estará en:
   C:\Users\USUARIO\AUTOMOTOSYNC_DES\android\app\build\outputs\apk\debug\app-debug.apk
```

**Ver guía completa en:** `GUIA_APK_ANDROID_STUDIO.md`

---

## 💻 OPCIÓN 2: Línea de Comandos (Avanzado)

### Paso 1: Descargar Java 21
- Ve a: https://adoptium.net/temurin/releases
- Descarga **JDK 21 LTS**
- Instala en la ruta por defecto

### Paso 2: Compilar APK
```powershell
# Abre PowerShell y ejecuta:
cd C:\Users\USUARIO\AUTOMOTOSYNC_DES

# Para APK de debug (testing):
.\build-apk.ps1 -type debug

# Para APK de release (Google Play):
.\build-apk.ps1 -type release
```

**El APK estará en:**
```
C:\Users\USUARIO\AUTOMOTOSYNC_DES\android\app\build\outputs\apk\debug\app-debug.apk
```

---

## 📲 INSTALAR EN TU TELÉFONO

### Opción A: USB (Recomendado)
```
1. Conecta tu teléfono por USB
2. Activa Depuración USB (Ajustes → Desarrollador)
3. En Android Studio: Click en "Run" (▶️)
4. ¡Instalado!
```

### Opción B: Enviar por email/WhatsApp
```
1. Encuentra el APK
2. Envía por email o WhatsApp
3. Abre en tu teléfono
4. ¡Instala!
```

---

## ✅ ¿Cuál opción elijo?

- **Android Studio** → Si quieres interfaz visual y no tienes prisa
- **Línea de Comandos** → Si ya tienes Java 21 y sabes usar PowerShell

---

## 🎯 TAMAÑO Y REQUERIMIENTOS

- **Tamaño APK:** ~30 MB
- **Android mínimo:** 6.0 (API 23)
- **Android recomendado:** 12+ (API 31+)

---

¡El APK estará listo en 5-10 minutos! 🎉
