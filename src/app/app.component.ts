import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, NavigationStart } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { 
  IonApp, IonSplitPane, IonMenu, IonHeader, IonToolbar, 
  IonTitle, IonContent, IonList, IonMenuToggle, IonItem, 
  IonIcon, IonLabel, IonRouterOutlet 
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { 
  homeOutline, peopleOutline, carOutline, documentTextOutline, 
  cubeOutline, settingsOutline 
} from 'ionicons/icons';
import { DatabaseService } from './core/services/database.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    IonApp,
    IonSplitPane,
    IonMenu,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonList,
    IonMenuToggle,
    IonItem,
    IonIcon,
    IonLabel,
    IonRouterOutlet
  ],
})
export class AppComponent implements OnInit {
  // IMPORTANTE: Inicializar en false para que el menú NO aparezca por defecto
  showMenu = false;
  
  // Rutas donde NO se debe mostrar el menú
  private readonly authRoutes = ['', '/', '/splash', '/login', '/registro', '/recuperar'];
  
  menuItems = [
    { title: 'Dashboard', url: '/dashboard', icon: 'home-outline' },
    { title: 'Clientes', url: '/clientes', icon: 'people-outline' },
    { title: 'Vehículos', url: '/vehiculos', icon: 'car-outline' },
    { title: 'Órdenes', url: '/ordenes', icon: 'document-text-outline' },
    { title: 'Inventario', url: '/inventario', icon: 'cube-outline' },
    { title: 'Configuración', url: '/configuracion', icon: 'settings-outline' }
  ];

  constructor(
    private db: DatabaseService,
    private router: Router
  ) {
    this.registerIcons();
    
    // Verificar ruta inicial INMEDIATAMENTE en el constructor
    this.updateMenuVisibility(this.router.url);
    
    // Escuchar TODOS los eventos de navegación
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        // Ocultar menú ANTES de navegar a rutas de auth
        this.updateMenuVisibility(event.url);
      } else if (event instanceof NavigationEnd) {
        // Actualizar después de completar navegación
        this.updateMenuVisibility(event.url);
      }
    });
  }

  async ngOnInit() {
    await this.db.init();

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.checkMenu(event.urlAfterRedirects);
      }
    });

  }

  private checkMenu(url: string) {
    // Mostrar menú solo si estamos en rutas autenticadas
    const authRoutes = ['/dashboard', '/clientes', '/vehiculos', '/ordenes', '/inventario', '/configuracion'];
    this.showMenu = authRoutes.some(r => url.startsWith(r));
  }

  private registerIcons() {
    addIcons({
      'home-outline': homeOutline,
      'people-outline': peopleOutline,
      'car-outline': carOutline,
      'document-text-outline': documentTextOutline,
      'cube-outline': cubeOutline,
      'settings-outline': settingsOutline
    });
  }

  private updateMenuVisibility(url: string) {
    const isAuthRoute = this.authRoutes.some(route => url.startsWith(route));
    this.showMenu = !isAuthRoute;
    
    // Debug
    console.log(`📍 URL: ${url} | Es ruta auth: ${isAuthRoute} | Mostrar menú: ${this.showMenu}`);
  }
}