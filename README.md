


🚀  Automotossync_des


 Esta es la aplicación principal para la plataforma de gestión y capacitación, desarrollada con el framework Ionic/Angular.

🌟 Características Principales
Basado en los archivos, las funcionalidades clave incluyen:

Estructura de la aplicación (/src): Contiene el código fuente principal para la lógica y la interfaz de usuario.

Módulos de Capacitación: Archivo de configuración (capacitacion.config.js) que sugiere la gestión de contenido de capacitación.

Integración y Configuración: Uso de Firebase (mencionado en el commit de angular.json).

Dashboard y Menús: Actualizaciones recientes en el dashboard y la estructura del menú principal.

Persistencia de Sesión: Implementación de persistencia para la sesión y el pipeline de la aplicación (visto en .gitpipe).

Eslint/Tslint Configurado: Uso de reglas de linting para mantener la calidad del código.

Build de Desarrollo Funcional: Se adjunta un .apk funcional para pruebas (app-debug.apk).

🛠️ Tecnologías Utilizadas
Este proyecto está construido principalmente con:

Angular: Framework principal de desarrollo.

Ionic: Plataforma para el desarrollo de aplicaciones móviles híbridas (sugerido por ionic.config.json).

TypeScript/JavaScript: Lenguajes de programación.

Node.js/npm: Herramientas para la gestión de paquetes (visto en package.json).

Firebase/Autenticación: (Sugerido por el commit de angular.json).

⚙️ Instalación y Configuración
Sigue estos pasos para configurar el entorno de desarrollo local:

1. Prerrequisitos
Asegúrate de tener instalados:

Node.js (Versión recomendada: v16.x o superior)

npm (Generalmente viene con Node.js)

Ionic CLI:

Bash

npm install -g @ionic/cli
2. Clonar el Repositorio
Bash

git clone [https://aws.amazon.com/es/what-is/repo/](https://github.com/JuanRestrepo5/AUTOMOTOSYNC_DES.git)
cd [Nombre del Repositorio]
3. Instalar Dependencias
Bash

npm install
(Esto instalará todas las dependencias listadas en package.json y package-lock.json)

4. Configuración de Entorno
Asegúrate de que la configuración de Firebase y otros entornos esté actualizada en el archivo angular.json o en los archivos de entorno correspondientes dentro de /src.

▶️ Ejecutar la Aplicación
Para ejecutar la aplicación en un navegador o emulador:

Bash

ionic serve
Para generar una build de Android o iOS, sigue la documentación de Ionic:

Bash

ionic cordova build android # o ios

