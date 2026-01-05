// Configuración de PRODUCCIÓN
// ⚠️ Credenciales vienen de variables de entorno en CI/CD
export const environment = {
  production: true,
  appName: 'AUTOMOTOSYNC',
  appVersion: '1.0.0',
  
  firebaseConfig: {
    apiKey: process.env['FIREBASE_API_KEY'] || "AIzaSyA_4hCDVQ1PPqWklRbJySHGooeWHEMs_oE",
    authDomain: process.env['FIREBASE_AUTH_DOMAIN'] || "automotosync-c5b81.firebaseapp.com",
    projectId: process.env['FIREBASE_PROJECT_ID'] || "automotosync-c5b81",
    storageBucket: process.env['FIREBASE_STORAGE_BUCKET'] || "automotosync-c5b81.firebasestorage.app",
    messagingSenderId: process.env['FIREBASE_MESSAGING_SENDER_ID'] || "411367610410",
    appId: process.env['FIREBASE_APP_ID'] || "1:411367610410:web:4f8beb93ca2e4e0857cb53",
    measurementId: process.env['FIREBASE_MEASUREMENT_ID'] || "G-7SQ5JK2XVD"
  },

  app: {
    defaultCurrency: 'COP',
    defaultCurrencySymbol: '$',
    defaultTax: 0.19,
    defaultLanguage: 'es',
    apiUrl: 'https://api.automotosync.com'
  },

  logging: {
    enableConsoleLog: false,
    enableRemoteLog: true
  }
};
