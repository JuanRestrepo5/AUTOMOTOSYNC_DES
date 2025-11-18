
📱 Proyecto Ionic + Angular + Capacitor

Estado: Activo
Última actualización: Se actualiza dashboard, menú y Firebase

📘 Descripción del Proyecto

Este proyecto es una aplicación híbrida desarrollada con Ionic, Angular y Capacitor, orientada a funcionar tanto como aplicación móvil (APK incluido) como aplicación web.
Incluye funcionalidades de autenticación, persistencia de sesión, configuración con Firebase y un dashboard interactivo.

El repositorio contiene todo el código fuente, configuración necesaria para el entorno de desarrollo, así como un APK funcional (app-debug.apk) listo para instalar.

🧱 Tecnologías Utilizadas
Frontend

Angular

Ionic Framework

TypeScript

SCSS

Mobile / Native

Capacitor

Android SDK

Configuración y Calidad

ESLint

EditorConfig

Servicios

Firebase (Auth / Firestore / Storage según configuración)

📂 Estructura del Proyecto

.
├── .vscode/                 # Configuración de VSCode
├── src/                    # Código fuente principal de la app
├── angular.json            # Configuración de Angular
├── capacitor.config.ts     # Configuración de Capacitor
├── ionic.config.json       # Configuración de Ionic
├── tsconfig*.json          # Configuración TypeScript
├── package.json            # Dependencias del proyecto
├── app-debug.apk           # APK funcional para Android
├── README.md               # Este archivo
└── .gitignore              # Archivos ignorados por Git

🛠️ Requisitos Previos

Antes de iniciar, asegúrate de tener instalado:

Node.js (v16+ recomendado)

Ionic CLI

npm install -g @ionic/cli

Angular CLI

npm install -g @angular/cli

Android Studio (si deseas compilar a APK)

Java JDK 11+

Capacitor CLI

npm install -g @capacitor/cli


🚀 Instalación y Ejecución
1️⃣ Clonar el repositorio

git clone [<URL_DEL_REPOSITORIO>](https://github.com/JuanRestrepo5/AUTOMOTOSYNC_DES.git)
cd AUTOMOTOSYNC_DES

2️⃣ Instalar dependencias
npm install

3️⃣ Ejecutar en entorno de desarrollo
ionic serve

📱 Ejecutar en dispositivo móvil (Android)
1. Sincronizar Capacitor
   npx cap sync
2. Abrir en Android Studio
   npx cap open android
3. Compilar APK desde Android Studio

También puedes instalar directamente el APK incluido:
app-debug.apk

🔥 Configuración de Firebase

El proyecto ya está configurado, pero si deseas cambiar credenciales:

Ir a Firebase Console.

Crear o seleccionar un proyecto.

Descargar archivo de configuración:

WEB: Variables en environment.ts.

ANDROID: google-services.json → android/app/.

Sincronizar nuevamente:
npx cap sync android

🧪 Testing

Ejecutar pruebas unitarias:
npm test

Ejecutar pruebas de integración:
ng test

🛡️ Buenas Prácticas Implementadas

Uso de ESLint para mantener estilo consistente.

Estructura modular de Angular.

Persistencia de sesión optimizada.

Configuración de .editorconfig para homogeneidad.

Manejo de rutas seguro y organizado.
