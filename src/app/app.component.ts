import { Component, OnInit } from '@angular/core';
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
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
  standalone: true,
  imports: [
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
    IonRouterOutlet,
    CommonModule
  ],
})
export class AppComponent implements OnInit {
  menuItems = [
    { title: 'Dashboard', url: '/dashboard', icon: 'home-outline' },
    { title: 'Clientes', url: '/clientes', icon: 'people-outline' },
    { title: 'Vehículos', url: '/vehiculos', icon: 'car-outline' },
    { title: 'Órdenes', url: '/ordenes', icon: 'document-text-outline' },
    { title: 'Inventario', url: '/inventario', icon: 'cube-outline' },
    { title: 'Configuración', url: '/configuracion', icon: 'settings-outline' }
  ];

  constructor(private db: DatabaseService) {
    this.registerIcons();
  }

  async ngOnInit() {
    await this.db.init();
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