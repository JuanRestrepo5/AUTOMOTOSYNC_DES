import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd, NavigationStart } from '@angular/router';
import { DatabaseService } from './core/services/database.service';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    IonicModule
  ]
})
export class AppComponent implements OnInit {

  showMenu = false;

  // Rutas donde NO se muestra el menú
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
    // Verificar ruta inicial
    this.updateMenuVisibility(this.router.url);

    // Escuchar eventos de navegación
    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart || event instanceof NavigationEnd) {
        this.updateMenuVisibility(event instanceof NavigationStart ? event.url : (event as NavigationEnd).urlAfterRedirects);
      }
    });
  }

  async ngOnInit() {
    await this.db.init();
  }

  private updateMenuVisibility(url: string) {
    const isAuthRoute = this.authRoutes.includes(url);
    this.showMenu = !isAuthRoute;

    console.log(`📍 URL: ${url} | Es ruta auth: ${isAuthRoute} | Mostrar menú: ${this.showMenu}`);
  }
}
