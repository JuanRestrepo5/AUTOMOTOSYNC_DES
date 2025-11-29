# 📱 Guía: Generar APK con Android Studio

## Paso 1: Descargar Android Studio
1. Ve a: https://developer.android.com/studio
2. Descarga **Android Studio** (última versión)
3. Ejecuta el instalador y sigue los pasos por defecto

---

## Paso 2: Abrir el Proyecto Android
1. Abre **Android Studio**
2. Click en **File → Open**
3. Navega a: `C:\Users\USUARIO\AUTOMOTOSYNC_DES\android`
4. Click en **Select Folder** (o Open)
5. **Espera a que termine de sincronizar** (puede tomar 2-5 minutos)

---

## Paso 3: Compilar el APK
### Opción A: APK de Debug (para testing/desarrollo)

1. En el menú superior: **Build → Build Bundle(s) / APK(s) → Build APK(s)**
2. Android Studio comenzará a compilar
3. Verás un mensaje "Build Successful" cuando termine
4. Click en **Locate** para abrir la carpeta con el APK

**Ubicación del APK:**
```
C:\Users\USUARIO\AUTOMOTOSYNC_DES\android\app\build\outputs\apk\debug\app-debug.apk
```

---

### Opción B: APK de Release (para Google Play Store)

1. Ve a **Build → Generate Signed Bundle / APK**
2. Selecciona **APK** → Click **Next**
3. Si no tienes keystore:
   - Click en **Create new...** 
   - Rellena los datos:
     - **Key store path:** `C:\Users\USUARIO\AUTOMOTOSYNC_DES\automotosync.jks`
     - **Password:** (elige una contraseña segura)
     - **Key alias:** automotosync
     - **Key password:** (mismo que arriba)
     - Rellena Organization, Country, etc.
   - Click **Create**
4. Click **Next**
5. Selecciona **release** → Click **Finish**
6. Espera a que compile (puede tomar 3-5 minutos)
7. Click en **Locate** para ver el APK

**Ubicación del APK de Release:**
```
C:\Users\USUARIO\AUTOMOTOSYNC_DES\android\app\release\app-release.apk
```

---

## Paso 4: Instalar en tu dispositivo Android

### Opción A: Por USB (Recomendado)
1. Conecta tu teléfono Android por USB
2. En tu teléfono: **Ajustes → Información del dispositivo → Opciones de desarrollador** (toca 7 veces el número de compilación)
3. Activa **Depuración USB**
4. En Android Studio: Verás tu teléfono en el desplegable superior
5. Click en **Run 'app'** (▶️ verde) para instalar

### Opción B: Por línea de comandos
```powershell
# Instalar APK de debug
adb install "C:\Users\USUARIO\AUTOMOTOSYNC_DES\android\app\build\outputs\apk\debug\app-debug.apk"

# Iniciar la app
adb shell am start -n com.tuempresa.automotosync/.MainActivity
```

### Opción C: Enviar por email/WhatsApp
- Copia el APK a tu PC
- Envía por email o WhatsApp
- Abre en tu teléfono Android
- Android instalará automáticamente

---

## 🎉 ¡Listo!

Tu app **AUTOMOTOSYNC** estará instalada en tu teléfono con todas las funcionalidades:
- ✅ Clientes y Vehículos
- ✅ Órdenes de Servicio
- ✅ Inventario con movimientos
- ✅ Facturas automáticas
- ✅ Reportes y análisis
- ✅ Sincronización offline

---

## ⚠️ Solución de Problemas

### "Cannot find Android SDK"
1. En Android Studio: **File → Project Structure**
2. Click en **SDK Location**
3. Si está vacío, haz click en **Edit** y sigue los pasos para descargar el SDK

### "Build failed: Gradle sync failed"
1. Click en **Sync Now** en la notificación
2. O: **File → Sync Project with Gradle Files**
3. Espera a que descargue las dependencias

### "Android Gradle plugin requires Java 21"
1. Android Studio descargará automáticamente Java 21
2. Solo acepta el diálogo y espera

---

## 📝 Información del APK Generado

- **Nombre de la app:** AUTOMOTOSYNC
- **Package name:** com.tuempresa.automotosync
- **Versión:** 1.0
- **Tamaño aprox:** 25-35 MB
- **Requisitos mínimos:** Android 6.0 (API 23)
- **Requisitos recomendados:** Android 12+ (API 31+)

---

¿Tienes Android Studio instalado? ¡Abre el proyecto y compila!
