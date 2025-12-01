import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import {
  IonHeader, IonToolbar, IonButtons, IonMenuButton, IonTitle, IonContent,
  IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonItem, IonLabel,
  IonInput, IonList, IonButton, IonIcon, IonText, IonCheckbox,
  AlertController, ToastController, LoadingController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { 
  cloudDoneOutline, cloudOfflineOutline, logOutOutline, refreshOutline 
} from 'ionicons/icons';

import { AuthService } from '../../core/services/auth.service';
import { SyncService } from '../../core/services/sync.service';
import { FirebaseSyncService } from '../../core/services/firebase-sync.service';

@Component({
  selector: 'app-configuracion',
  templateUrl: './configuracion.page.html',
  styleUrls: ['./configuracion.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonHeader, IonToolbar, IonButtons, IonMenuButton, IonTitle, IonContent,
    IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonItem, IonLabel,
    IonInput, IonList, IonButton, IonIcon, IonText, IonCheckbox
  ]
})
export class ConfiguracionPage implements OnInit {
  usuario: any = {
    nombre: 'Admin Taller',
    email: 'admin@taller.com'
  };
  
  isOnline = false;
  ultimaSync = 'Hace 5 minutos';

  constructor(
    private authService: AuthService,
    private syncService: SyncService,
    private firebaseSyncService: FirebaseSyncService,
    private router: Router,
    private alertController: AlertController,
    private toastController: ToastController, 
    private loadingController: LoadingController
  ) {
    this.registerIcons();
  }

  private registerIcons() {
    addIcons({
      'cloud-done-outline': cloudDoneOutline,
      'cloud-offline-outline': cloudOfflineOutline,
      'log-out-outline': logOutOutline,
      'refresh-outline': refreshOutline
    });
  }

  async ngOnInit() {
    await this.loadUserData();
    this.isOnline = this.syncService.getConnectionStatus();
  }

async loadUserData() {
  try {
    const user: any = await this.authService.getCurrentUser();

    if (!user) {
      // No hay usuario autenticado
      this.usuario = {
        nombre: 'Invitado',
        email: ''
      };
      return;
    }

    this.usuario = {
      nombre: user.displayName ?? 'Usuario',
      email: user.email ?? ''
    };

  } catch (error) {
    console.error('Error cargando datos del usuario:', error);
  }
}


  async sincronizarManual() {
    const loading = await this.loadingController.create({
      message: '🔄 Sincronizando datos desde Firebase...',
      spinner: 'crescent'
    });
    await loading.present();


    try {
      // Primero sincronizar desde Firebase a local
      await this.firebaseSyncService.syncAllFromFirebase();

      // Luego sincronizar cambios locales pendientes a Firebase
      await this.syncService.syncAll();
      
      this.ultimaSync = 'Justo ahora';
      await loading.dismiss();
      await this.showToast('✓ Sincronización completada Datos actualizados', 'success');
      /*
      const toast = await this.toastController.create({
        message: '🔄 Sincronizando datos...',
        duration: 1500,
        position: 'top'
      });
      await toast.present();

      await this.syncService.syncAll();
      
      await this.showToast('✓ Sincronización completada', 'success');*/
    } catch (error) {
      console.error('Error sincronizando:', error);
      await loading.dismiss();
      await this.showToast('Error en la sincronización', 'danger');
    }
  }

  async confirmarCerrarSesion() {
    const alert = await this.alertController.create({
      header: 'Cerrar Sesión',
      message: '¿Está seguro que desea cerrar sesión?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Cerrar Sesión',
          role: 'destructive',
          handler: async () => {
            await this.cerrarSesion();
          }
        }
      ]
    });

    await alert.present();
  }

  async cerrarSesion() {
    try {
      await this.authService.logout();
      this.router.navigate(['/login']);
    } catch (error) {
      console.error('Error cerrando sesión:', error);
      await this.showToast('Error al cerrar sesión', 'danger');
    }
  }

  async showToast(message: string, color: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      color,
      position: 'top'
    });
    await toast.present();
  }
}