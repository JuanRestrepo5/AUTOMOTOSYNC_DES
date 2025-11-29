import { Component } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { DatabaseService } from './core/services/database.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import {
  IonApp, IonMenu, IonHeader, IonToolbar,
  IonTitle, IonContent, IonList, IonMenuToggle, IonItem,
  IonIcon, IonLabel, IonRouterOutlet
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import {
  homeOutline, peopleOutline, carOutline, documentTextOutline,
  cubeOutline, settingsOutline
} from 'ionicons/icons';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    IonApp,
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
  ]
})
export class AppComponent {
  showMenu = false;

  // Lista de rutas donde el menú NO debe mostrarse
  private routesWithoutMenu = ['/', '/splash', '/login', '/registro', '/recuperar'];

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
    this.db.init();

    // Escuchar los eventos de navegación para decidir si se muestra el menú
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        // Comprueba si la URL actual está en la lista de rutas sin menú
        const shouldHideMenu = this.routesWithoutMenu.includes(event.urlAfterRedirects);
        this.showMenu = !shouldHideMenu;
        console.log('URL:', event.urlAfterRedirects, 'showMenu:', this.showMenu);
      }
    });

    // Mostrar menú al cargar si está en una ruta permitida
    const currentUrl = this.router.url;
    const shouldHideMenu = this.routesWithoutMenu.includes(currentUrl);
    this.showMenu = !shouldHideMenu;
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
}