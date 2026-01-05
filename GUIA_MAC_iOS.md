# 🍎 COMPILAR AUTOMOTOSYNC EN MAC E INSTALAR EN iOS

## 📋 REQUISITOS PREVIOS

Antes de empezar, asegúrate de tener:

```bash
✓ Mac con macOS 12.0 o superior
✓ Xcode instalado (App Store o developer.apple.com)
✓ Xcode Command Line Tools
✓ Node.js y npm instalados
✓ Ionic CLI instalado globalmente
✓ Capacitor CLI instalado
✓ Acceso a cuenta Apple Developer (opcional para dispositivo real)
```

### Verificar instalaciones:

```bash
# Verificar Xcode
xcode-select --print-path

# Verificar Node
node --version

# Verificar npm
npm --version

# Verificar Ionic
ionic --version

# Verificar Capacitor
npx cap --version
```

---

## 🚀 PASOS PARA COMPILAR EN MAC

### PASO 1: Transferir el código a Mac

```bash
# Opción A: Desde Git (RECOMENDADO)
git clone https://github.com/JuanRestrepo5/AUTOMOTOSYNC_DES.git
cd AUTOMOTOSYNC_DES

# Opción B: Copiar carpeta completa
# Copiar carpeta C:\Users\USUARIO\AUTOMOTOSYNC_DES a Mac
```

### PASO 2: Instalar dependencias del proyecto

```bash
# En la carpeta del proyecto
cd AUTOMOTOSYNC_DES

# Instalar todas las dependencias
npm install --legacy-peer-deps

# Esperar a que termine (2-3 minutos)
```

### PASO 3: Compilar el proyecto Angular/Ionic

```bash
# Compilar para producción
ionic build --prod

# Esperar a que termine (esta es la parte más lenta, 5-10 minutos)
# Resultado: carpeta www/ con los archivos compilados
```

### PASO 4: Preparar Capacitor para iOS

```bash
# Copiar archivos compilados a iOS
ionic capacitor copy ios

# O si Capacitor aún no está inicializado:
npx cap init automotosync com.leo17mart.automotosync

# Luego agregar iOS
npx cap add ios

# Finalmente copiar
ionic capacitor copy ios
```

### PASO 5: Abrir el proyecto en Xcode

```bash
# Opción A: Desde terminal
open ios/App/App.xcworkspace

# Opción B: Manualmente
# 1. Abrir Finder
# 2. Navegar a: AUTOMOTOSYNC_DES/ios/App/
# 3. Hacer doble click en App.xcworkspace (NO App.xcodeproj)
```

### PASO 6: Configurar Xcode

Una vez abierto Xcode:

```
1. Seleccionar el proyecto "App" en la parte izquierda
   └─ Carpeta azul "App"

2. Ir a "Signing & Capabilities"
   └─ Pestaña en la parte superior

3. Configurar Team:
   ├─ Team: Selecciona tu equipo de Apple Developer
   │  (Si no tienes, haz click en "Add Account")
   └─ Bundle Identifier: com.leo17mart.automotosync

4. Seleccionar dispositivo:
   ├─ En la parte superior (donde dice "App")
   └─ Selecciona tu iPhone conectado por USB
     (O selecciona un simulador como "iPhone 15")

5. Habilitar capacidades (si es necesario):
   └─ Ir a "Signing & Capabilities"
   └─ Click "+ Capability"
   └─ Agregar: "Network Extension" (si la app accede a internet)
```

### PASO 7: Compilar y ejecutar en Xcode

```
OPCIÓN A: Compilar y ejecutar en simulador
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. En Xcode: Product > Scheme > App
2. Seleccionar simulador (ej: iPhone 15)
3. Product > Build (⌘B)
4. Product > Run (⌘R)

OPCIÓN B: Compilar y ejecutar en iPhone real
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. Conectar iPhone por USB
2. En Xcode: Confiar en el dispositivo
   └─ El iPhone te pide confirmación: Tocar "Confiar"
3. Seleccionar el iPhone en la parte superior
4. Product > Build (⌘B)
5. Product > Run (⌘R)
6. Esperar a que la app se instale y abra
```

---

## 🎯 GENERAR IPA PARA DISTRIBUCIÓN

Si quieres crear un archivo IPA para distribuir sin Xcode:

### OPCIÓN 1: Generar IPA desde Xcode (Recomendado)

```
1. En Xcode: Product > Scheme > App
2. Cambiar a "Release" en el menú
3. Product > Build for Testing (⌘B)
4. Product > Archive
5. Esperar a que termine
6. En la ventana "Organizer":
   └─ Seleccionar la compilación más reciente
   └─ Click "Distribute App"
   └─ Seleccionar "Custom Distribution"
   └─ Seleccionar "Export"
   └─ Guardar como AUTOMOTOSYNC-v1.0.0.ipa
```

### OPCIÓN 2: Usar xcodebuild en terminal

```bash
# Compilar
xcodebuild -workspace ios/App/App.xcworkspace \
  -scheme App \
  -configuration Release \
  -derivedDataPath build

# Crear IPA
xcodebuild -exportArchive \
  -archivePath build/App.xcarchive \
  -exportPath ios/build \
  -exportOptionsPlist ExportOptions.plist
```

---

## 📱 INSTALAR EN iOS

### OPCIÓN A: Desde Xcode (Más fácil)

```
1. Conectar iPhone por USB
2. En Xcode: Product > Run (⌘R)
3. La app se instala automáticamente
4. En iPhone: Abrir AUTOMOTOSYNC
```

### OPCIÓN B: Desde Finder (macOS 13+)

```
1. Generar IPA (ver pasos arriba)
2. Conectar iPhone por USB
3. Abrir Finder
4. Ir a "Devices" (lateral izquierdo)
5. Seleccionar tu iPhone
6. Ir a "Apps"
7. Arrastrar AUTOMOTOSYNC-v1.0.0.ipa al área de aplicaciones
8. Esperar a que instale
```

### OPCIÓN C: Usando Apple Configurator 2

```
1. Descargar "Apple Configurator 2" desde App Store
2. Conectar iPhone por USB
3. Abrir Apple Configurator 2
4. Seleccionar tu iPhone
5. Click derecho > "Add" > "Apps"
6. Seleccionar AUTOMOTOSYNC-v1.0.0.ipa
7. Confirmar instalación
```

### OPCIÓN D: TestFlight (Para distribución a testers)

```
1. Subir IPA a App Store Connect
2. Crear versión en TestFlight
3. Agregar direcciones email de testers
4. Los testers descargan desde TestFlight
5. Instala automáticamente en su iPhone
```

---

## 🔧 SOLUCIÓN DE PROBLEMAS COMUNES

### Error: "No se puede abrir la app"

```
Causa: Certificado no confiable
Solución:
1. iPhone: Ajustes > General > Gestión de dispositivos
2. Seleccionar el certificado de desarrollo
3. Click "Confiar"
4. Intentar de nuevo
```

### Error: "Bundle identifier ya existe"

```
Causa: El Bundle ID está registrado en otra cuenta
Solución:
1. Cambiar Bundle ID en Xcode:
   └─ Project > App > Build Settings > Bundle Identifier
2. Cambiar a: com.tunombre.automotosync
3. Compilar de nuevo
```

### Error: "No se puede conectar a internet"

```
Causa: Permisos de red no configurados
Solución:
1. En Xcode: Project > App > Signing & Capabilities
2. Click "+ Capability"
3. Agregar "Outgoing Connections (Client)"
4. Compilar de nuevo
```

### Error: "La app se cierra al abrir"

```
Causa: Credenciales de Firebase no configuradas
Solución:
1. Abrir la app
2. Ir a Ajustes > Acerca de
3. Verificar que Firebase está conectado
4. Si no, configurar credenciales en environment.prod.ts
5. Recompilar
```

---

## 📊 VERIFICAR QUE FUNCIONA

Después de instalar:

```
1. Abrir AUTOMOTOSYNC en iPhone
2. Ir a "Login"
3. Ingresar credenciales de Firebase
4. Crear un cliente de prueba
5. Crear un vehículo
6. Crear una orden
7. Agregar repuesto a la orden
8. Generar factura

Si todo funciona sin errores: ✅ ¡Éxito!
```

---

## 🔑 NOTAS IMPORTANTES

### Certificados y Provisioning

```
• Para dispositivo de prueba: Solo necesitas Xcode
• Para distribuir en App Store: Necesitas cuenta Apple Developer
• Los certificados vencen cada año
• Los perfiles de provisioning expiran periódicamente
```

### Configuración Firebase

```
• Asegúrate de que Firebase está configurado
• Archivo: src/environments/environment.prod.ts
• Variables de entorno: FIREBASE_API_KEY, etc.
• En producción: usar variables reales
```

### Configuración de Build

```
Build para simulador:
├─ Rápido (segundos)
├─ Solo para pruebas
└─ No se puede distribuir

Build para dispositivo real:
├─ Más lento (minutos)
├─ Se puede distribuir
└─ Necesita certificados válidos
```

---

## 📝 COMANDOS RÁPIDOS

```bash
# Toda la secuencia en una línea
npm install --legacy-peer-deps && \
ionic build --prod && \
ionic capacitor copy ios && \
open ios/App/App.xcworkspace

# O paso a paso
npm install --legacy-peer-deps    # 2-3 min
ionic build --prod                # 5-10 min
ionic capacitor copy ios          # 1 min
open ios/App/App.xcworkspace      # Abre Xcode

# Desde Xcode: ⌘R para ejecutar
```

---

## 🎯 RESUMEN RÁPIDO

| Paso | Comando | Tiempo |
|------|---------|--------|
| 1. Instalar deps | `npm install --legacy-peer-deps` | 2-3 min |
| 2. Compilar | `ionic build --prod` | 5-10 min |
| 3. Capacitor | `ionic capacitor copy ios` | 1 min |
| 4. Xcode | `open ios/App/App.xcworkspace` | - |
| 5. Build en Xcode | ⌘B | 2-5 min |
| 6. Run en Xcode | ⌘R | 1 min |
| **TOTAL** | | **~15-25 min** |

---

## ❓ PREGUNTAS FRECUENTES

**P: ¿Necesito pagar para desarrollar en iOS?**
R: No, puedes probar en simulador gratis. Para dispositivo real y App Store, necesitas cuenta Apple Developer ($99/año).

**P: ¿Puedo usar Windows para compilar iOS?**
R: No, necesitas Mac. Pero puedes usar servicios como MacStadium o Bitrise.

**P: ¿Cuánto tarda la compilación?**
R: Primero (npm install): 2-3 min. Compilar Angular: 5-10 min. Compilar iOS: 2-5 min.

**P: ¿Puedo instalar sin Xcode?**
R: Sí, usando TestFlight o Apple Configurator 2.

**P: ¿Qué pasa si cambio el código?**
R: Repite desde el paso 3 (ionic build --prod).

---

**¡Listo! Ahora tienes AUTOMOTOSYNC en tu iPhone! 🎉**
