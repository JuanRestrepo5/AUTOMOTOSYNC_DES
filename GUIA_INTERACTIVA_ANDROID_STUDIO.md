# 🚀 Guía Interactiva: Android Studio

## Paso 1: Descarga e Instalación

### Opción A: Instalación Automática (Recomendado)
1. Ve a: `C:\Users\USUARIO\AUTOMOTOSYNC_DES`
2. Ejecuta: `instalar-android-studio.bat`
3. Espera a que se descargue (5-10 minutos)
4. Sigue los pasos del instalador
5. Continúa con **Paso 2**

### Opción B: Instalación Manual
1. Ve a: https://developer.android.com/studio
2. Click en **Download Android Studio**
3. Acepta los términos
4. Descarga e instala
5. Continúa con **Paso 2**

---

## Paso 2: Abrir el Proyecto

### Cuando Android Studio esté abierto:

1. **Click en "File"** (esquina superior izquierda)
   ```
   File → Open
   ```

2. **Selecciona la carpeta del proyecto:**
   ```
   C:\Users\USUARIO\AUTOMOTOSYNC_DES\android
   ```

3. **Click en "Open"** o "Select Folder"

4. **ESPERA a que sincronice** (verás una barra de progreso)
   - Esto puede tomar 2-5 minutos
   - Descargará dependencias de Gradle
   - ¡NO CIERRES ANDROID STUDIO!

5. **Cuando veas "Build Successful"** en la parte inferior, continúa con **Paso 3**

---

## Paso 3: Compilar el APK

### Cuando ya esté sincronizado:

1. **Click en "Build"** (menú superior)
   ```
   Build → Build Bundle(s) / APK(s) → Build APK(s)
   ```

2. **Espera a que compile**
   - Verás una barra de progreso
   - Puede tomar 2-5 minutos
   - Es normal ver varios mensajes

3. **Cuando veas "Build Successful":**
   - Click en **"Locate"** en la notificación inferior derecha
   - O: **Click derecho en el proyecto → Show in Explorer**

---

## Paso 4: ¿Dónde está el APK?

**APK de Debug (para testing):**
```
C:\Users\USUARIO\AUTOMOTOSYNC_DES\android\app\build\outputs\apk\debug\app-debug.apk
```

**APK de Release (para Play Store):**
```
C:\Users\USUARIO\AUTOMOTOSYNC_DES\android\app\release\app-release.apk
```

---

## Paso 5: Instalar en tu Teléfono

### Opción A: Por USB (Recomendado)

1. **Conecta tu teléfono por USB**

2. **En tu teléfono Android:**
   ```
   Ajustes → Información del dispositivo
   → Número de compilación (toca 7 veces)
   → Vuelve atrás
   → Opciones de desarrollador
   → Activar Depuración USB
   ```

3. **En Android Studio:**
   - Verás tu teléfono en el desplegable superior
   - Click en el botón **Run** (▶️ verde)
   - ¡Se instalará automáticamente!

### Opción B: Por email/WhatsApp

1. Copia el APK a tu computadora
2. Envía por email o WhatsApp
3. Abre en tu teléfono Android
4. Android te preguntará si deseas instalar
5. Click en **Instalar**

### Opción C: Por línea de comandos

```powershell
# Instalar APK
adb install "C:\Users\USUARIO\AUTOMOTOSYNC_DES\android\app\build\outputs\apk\debug\app-debug.apk"

# Abrir la app
adb shell am start -n com.tuempresa.automotosync/.MainActivity
```

---

## ⚠️ Solución de Problemas

### "Gradle sync failed"
- Click en **Sync Now** en la notificación
- O: **File → Sync Project with Gradle Files**
- Espera a que termine

### "Cannot find Android SDK"
- **File → Project Structure → SDK Location**
- Click en **Edit**
- Sigue los pasos para descargar el SDK

### "Build failed: Java version"
- Android Studio descargará Java automáticamente
- Solo acepta el diálogo y espera

### "The APK is not signed"
- Esto es normal en debug
- Simplemente instálalo en tu teléfono

---

## ✅ Checklist

- [ ] Android Studio descargado
- [ ] Android Studio instalado
- [ ] Proyecto abierto en Android Studio
- [ ] Gradle sincronizado (Build Successful)
- [ ] APK compilado
- [ ] APK descargado
- [ ] APK instalado en teléfono
- [ ] App funcionando en teléfono

---

## 🎉 ¡Listo!

Tu app **AUTOMOTOSYNC** estará en tu teléfono con:
- ✅ Clientes y Vehículos
- ✅ Órdenes de Servicio
- ✅ Inventario completo
- ✅ Facturas automáticas
- ✅ Reportes y análisis
- ✅ Sincronización offline

---

**¿Problemas?** Lee la sección "Solución de Problemas" arriba.

**¿Necesitas ayuda?** Contacta al equipo de desarrollo.
