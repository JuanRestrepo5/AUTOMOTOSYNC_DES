import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
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
  showMenu = false;
  
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
  }

  async ngOnInit() {
    await this.db.init();
    this.setupMenuVisibility();
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

  private setupMenuVisibility() {
    // Verificar ruta inicial
    this.checkRoute(this.router.url);

    // Escuchar cambios de ruta
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.checkRoute(event.url);
      }
    });
  }

  private checkRoute(url: string) {
    const authRoutes = ['/splash', '/login', '/registro', '/recuperar'];
    this.showMenu = !authRoutes.some(route => url.includes(route));
    console.log('URL:', url, '| Mostrar menú:', this.showMenu);
  }
}