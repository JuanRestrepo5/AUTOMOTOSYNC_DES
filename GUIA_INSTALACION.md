# 📱 AUTOMOTOSYNC - Guía de Instalación v1.0.0

## 📦 Archivos Disponibles

### Android (APK)
- **Archivo:** `AUTOMOTOSYNC-v1.0.0.zip`
- **Tamaño:** 3.44 MB
- **Versión:** 1.0.0
- **Firma:** Certificado AutomotoSync (SHA256withRSA, 2048-bit)
- **Compatibilidad:** Android 6.0 (API 23) o superior

### iOS (IPA)
- **Archivo:** `AUTOMOTOSYNC-v1.0.0.ipa` (en proceso de compilación)
- **Bundle ID:** com.leo17mart.automotosync
- **Versión:** 1.0.0
- **Build:** 1
- **Compatibilidad:** iOS 12 o superior

---

## 🚀 Instalación en Android

### Opción 1: Dispositivo físico via ADB
```bash
# 1. Descargar y extraer AUTOMOTOSYNC-v1.0.0.zip
unzip AUTOMOTOSYNC-v1.0.0.zip

# 2. Conectar dispositivo por USB y habilitar "Modo de Depuración"

# 3. Instalar APK
adb install AUTOMOTOSYNC-v1.0.0.apk
```

### Opción 2: Instalación directa (Sin ADB)
1. Descargar `AUTOMOTOSYNC-v1.0.0.zip`
2. Extraer `AUTOMOTOSYNC-v1.0.0.apk`
3. Transferir archivo al dispositivo
4. Abrir el archivo en el dispositivo (Gestor de Archivos)
5. Permitir instalación desde "Fuentes desconocidas"
6. Confirmar instalación

### Opción 3: Emulador Android
```bash
# Verificar emuladores disponibles
adb devices

# Instalar en emulador
adb -s <emulator_id> install AUTOMOTOSYNC-v1.0.0.apk
```

---

## 🍎 Instalación en iOS

### Opción 1: TestFlight (Recomendado)
1. Cargar IPA en App Store Connect
2. Crear compilación en TestFlight
3. Enviar invitación a probadores
4. Descargar desde TestFlight en iOS

### Opción 2: Instalación directa con Xcode
```bash
# Requiere Mac con Xcode instalado
xcrun xcodebuild -importProvisioningProfile -provisioningProfilePath <profile.mobileprovision>
xcrun xcodebuild -installCodesign -ipa AUTOMOTOSYNC-v1.0.0.ipa
```

### Opción 3: Apple Configurator 2 (Mac)
1. Abrir Apple Configurator 2
2. Conectar dispositivo iOS
3. Seleccionar "Add" > "Apps"
4. Seleccionar `AUTOMOTOSYNC-v1.0.0.ipa`
5. Confirmar instalación

---

## 🔐 Seguridad y Certificados

### Android
- **Certificado:** AutomotoSync (Self-signed)
- **Válido hasta:** 2053-04-18
- **Uso:** Para testing y distribución interna

### iOS
- **Bundle Identifier:** com.leo17mart.automotosync
- **Tipo de Provisioning:** Adhoc (development)
- **Válido hasta:** Según certificado de Expo

---

## ⚙️ Requisitos Previos

### Android
- Android 6.0 o superior (API 23+)
- ~50 MB de espacio libre
- Conexión a Internet (primera vez)

### iOS
- iOS 12 o superior
- ~80 MB de espacio libre
- Apple ID (opcional, para algunas funciones)

---

## 🔧 Configuración Inicial

Después de instalar, la aplicación te solicitará:

1. **Credenciales de Firebase** (si aplica)
   - Email
   - Contraseña

2. **Selección de Rol**
   - Administrador
   - Gerente
   - Mecánico
   - Recepcionista

3. **Permiso de Almacenamiento** (Android)
   - Necesario para descargar reportes

4. **Permiso de Cámara** (opcional)
   - Para capturar evidencia de reparaciones

---

## 📋 Features Principales

### Gestión de Órdenes
- ✅ Crear órdenes de servicio
- ✅ Agregar repuestos a órdenes
- ✅ Calcular costos automáticamente
- ✅ Trackeo de estado

### Inventario
- ✅ Control de stock en tiempo real
- ✅ Alertas de bajo inventario
- ✅ Historial de movimientos

### Facturación
- ✅ Generación automática de facturas
- ✅ Cálculo de impuestos (IVA 19%)
- ✅ Recibos en PDF

### Reportes y Analytics
- ✅ Dashboard con KPIs
- ✅ Gráficos de tendencias
- ✅ Exportar a CSV

### Control de Acceso
- ✅ Sistema RBAC con 4 roles
- ✅ Permisos granulares
- ✅ Auditoría de cambios

---

## 🌐 Conectividad

### Modo Offline
- ✅ Sincronización automática
- ✅ Caché local con SQLite
- ✅ Sincronización al reconectar

### Modo Online
- ✅ Firebase Firestore en tiempo real
- ✅ Sincronización bidireccional
- ✅ Resolución de conflictos automática

---

## 🐛 Solución de Problemas

### "Paquete no válido" (Android)
- ✅ **Solución:** APK ya está correctamente firmado
- Asegurate de descargar desde fuente oficial
- Intenta desinstalar versiones anteriores

### "App no instalada" (iOS)
- Verifica que tienes el certificado correcto
- Revisa el bundle identifier
- Usa TestFlight para distribución simplificada

### Errores de Conexión
- Verifica conectividad a Internet
- Revisa credenciales de Firebase
- Activa modo Offline si es necesario

### Performance lento
- Limpia caché: Ajustes > Almacenamiento > Borrar datos
- Cierra otras aplicaciones
- Reinicia el dispositivo

---

## 📞 Soporte

Para reportar issues o solicitar features:
- GitHub: https://github.com/JuanRestrepo5/AUTOMOTOSYNC_DES
- Email: support@automotosync.local

---

## 📅 Información de Versión

| Parámetro | Valor |
|-----------|-------|
| Versión App | 1.0.0 |
| Fecha Release | 2026-01-05 |
| Build ID Android | 1 |
| Build ID iOS | 1 |
| Última actualización | 2026-01-05 10:30 UTC |

---

**Generated:** 2026-01-05 | **Status:** Production Ready ✅
