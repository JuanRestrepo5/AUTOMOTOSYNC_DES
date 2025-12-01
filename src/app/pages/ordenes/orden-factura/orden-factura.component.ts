// src/app/pages/ordenes/orden-factura/orden-factura.component.ts
import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonCard, IonCardContent, IonCardHeader, IonCardTitle,
  IonButton, IonIcon, IonSpinner, IonText, IonBadge,
  ToastController, AlertController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { document, download } from 'ionicons/icons';

import { FacturaService } from '../../../core/services/factura.service';
import { OrdersService } from '../../../core/services/orders.service';
import { DatabaseService } from '../../../core/services/database.service';
import { Orden } from '../../../core/models/orden.model';
import { Factura } from '../../../core/models/factura.model';

@Component({
  selector: 'app-orden-factura',
  templateUrl: './orden-factura.component.html',
  styleUrls: ['./orden-factura.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    IonCard, IonCardContent, IonCardHeader, IonCardTitle,
    IonButton, IonIcon, IonSpinner, IonText, IonBadge
  ]
})
export class OrdenFacturaComponent implements OnInit {
  @Input() ordenId!: string;
  @Input() orden!: Orden | undefined;

  facturasEmitidas: Factura[] = [];
  generandoFactura = false;
  facturaGenerada: Factura | undefined;

  constructor(
    private facturaService: FacturaService,
    private ordersService: OrdersService,
    private db: DatabaseService,
    private toastController: ToastController,
    private alertController: AlertController
  ) {
    addIcons({ document, download });
  }

  async ngOnInit() {
    if (this.ordenId) {
      await this.cargarFacturas();
    }
  }

  async cargarFacturas() {
    try {
      this.facturasEmitidas = await this.facturaService.obtenerFacturasPorOrden(this.ordenId);
    } catch (error) {
      console.error('Error cargando facturas:', error);
    }
  }

  async generarFactura() {
    if (!this.orden || !this.orden.items || this.orden.items.length === 0) {
      await this.mostrarError('La orden debe tener al menos un repuesto');
      return;
    }

    this.generandoFactura = true;
    try {
      const facturaId = await this.facturaService.generarFactura(
        this.ordenId,
        this.orden.items
      );

      this.facturaGenerada = await this.facturaService.obtenerFacturaById(facturaId);
      await this.cargarFacturas();
      await this.mostrarExito('Factura generada exitosamente');
    } catch (error: any) {
      await this.mostrarError(error.message || 'Error al generar factura');
    } finally {
      this.generandoFactura = false;
    }
  }

  async descargarFacturaPDF(factura: Factura) {
    if (!this.orden) {
      await this.mostrarError('Orden no disponible');
      return;
    }
    try {
      const cliente = await this.db.getClienteById(factura.clienteId);
      await this.facturaService.descargarFacturaPDF(factura, cliente, this.orden);
      await this.mostrarExito('Descarga iniciada');
    } catch (error) {
      await this.mostrarError('Error al descargar PDF');
    }
  }

  async cambiarEstadoPago(factura: Factura) {
    if (factura.estado === 'pagada') {
      await this.mostrarError('Esta factura ya ha sido pagada');
      return;
    }

    const alert = await this.alertController.create({
      header: 'Registrar Pago',
      inputs: [
        {
          name: 'metodoPago',
          type: 'radio',
          label: 'Efectivo',
          value: 'efectivo',
          checked: true
        },
        {
          name: 'metodoPago',
          type: 'radio',
          label: 'Tarjeta',
          value: 'tarjeta'
        },
        {
          name: 'metodoPago',
          type: 'radio',
          label: 'Transferencia',
          value: 'transferencia'
        },
        {
          name: 'metodoPago',
          type: 'radio',
          label: 'Cheque',
          value: 'cheque'
        }
      ],
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Confirmar Pago',
          handler: async (metodoPago) => {
            try {
              await this.facturaService.registrarPago(
                factura.id!,
                metodoPago
              );
              await this.cargarFacturas();
              await this.mostrarExito('Pago registrado');
            } catch (error) {
              await this.mostrarError('Error al registrar pago');
            }
          }
        }
      ]
    });

    await alert.present();
  }

  obtenerBadgeColor(estado: string): string {
    switch (estado) {
      case 'emitida': return 'warning';
      case 'pagada': return 'success';
      case 'cancelada': return 'danger';
      case 'borrador': return 'medium';
      default: return 'primary';
    }
  }

  private async mostrarError(mensaje: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 2000,
      color: 'danger',
      position: 'bottom'
    });
    await toast.present();
  }

  private async mostrarExito(mensaje: string) {
    const toast = await this.toastController.create({
      message: mensaje,
      duration: 2000,
      color: 'success',
      position: 'bottom'
    });
    await toast.present();
  }
}
