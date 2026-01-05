import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';

/**
 * Servicio para mostrar diálogos de confirmación
 */
@Injectable({
  providedIn: 'root'
})
export class ConfirmationService {
  constructor(private alertController: AlertController) {}

  /**
   * Mostrar diálogo de confirmación de eliminación
   */
  async confirmDelete(itemName: string = 'este elemento'): Promise<boolean> {
    return new Promise(async (resolve) => {
      const alert = await this.alertController.create({
        header: 'Confirmar eliminación',
        message: `¿Estás seguro de que deseas eliminar ${itemName}? Esta acción no se puede deshacer.`,
        buttons: [
          {
            text: 'Cancelar',
            role: 'cancel',
            handler: () => resolve(false)
          },
          {
            text: 'Eliminar',
            role: 'destructive',
            handler: () => resolve(true)
          }
        ]
      });

      await alert.present();
    });
  }

  /**
   * Mostrar diálogo de confirmación genérica
   */
  async confirm(
    title: string = 'Confirmar',
    message: string = '¿Deseas continuar?',
    confirmText: string = 'Aceptar',
    cancelText: string = 'Cancelar'
  ): Promise<boolean> {
    return new Promise(async (resolve) => {
      const alert = await this.alertController.create({
        header: title,
        message,
        buttons: [
          {
            text: cancelText,
            role: 'cancel',
            handler: () => resolve(false)
          },
          {
            text: confirmText,
            handler: () => resolve(true)
          }
        ]
      });

      await alert.present();
    });
  }
}
