import { Injectable } from '@angular/core';
import { Network } from '@capacitor/network';
import { BehaviorSubject, Observable } from 'rxjs';

/**
 * Servicio para monitorear estado de conectividad
 */
@Injectable({
  providedIn: 'root'
})
export class ConnectivityService {
  private isOnline = new BehaviorSubject<boolean>(true);
  public isOnline$ = this.isOnline.asObservable();

  constructor() {
    this.initNetworkListener();
  }

  private async initNetworkListener(): Promise<void> {
    try {
      // Verificar estado actual
      const status = await Network.getStatus();
      this.isOnline.next(status.connected);

      // Escuchar cambios
      Network.addListener('networkStatusChange', (status) => {
        this.isOnline.next(status.connected);
        
        if (status.connected) {
          console.log('✓ Conexión restaurada');
        } else {
          console.log('✗ Conexión perdida - Modo offline');
        }
      });
    } catch (error) {
      console.error('Error inicializando monitoreo de red:', error);
    }
  }

  /**
   * Obtener estado actual de conectividad
   */
  getCurrentStatus(): boolean {
    return this.isOnline.value;
  }

  /**
   * Observable del estado de conectividad
   */
  getStatus$(): Observable<boolean> {
    return this.isOnline$;
  }
}
