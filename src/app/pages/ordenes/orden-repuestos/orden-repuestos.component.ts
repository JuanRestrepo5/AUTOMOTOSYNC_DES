// src/app/pages/ordenes/orden-repuestos/orden-repuestos.component.ts
import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {
  IonCard, IonCardContent, IonCardHeader, IonCardTitle,
  IonItem, IonLabel, IonSelect, IonSelectOption, IonInput,
  IonButton, IonIcon, IonList, IonListHeader, IonNote,
  IonBadge, IonAlert, AlertController, ToastController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { trash, add } from 'ionicons/icons';

import { OrdenItem } from '../../../core/models/orden-item.model';
import { Repuesto } from '../../../core/models/repuesto.model';
import { OrdersService } from '../../../core/services/orders.service';
import { DatabaseService } from '../../../core/services/database.service';

@Component({
  selector: 'app-orden-repuestos',
  templateUrl: './orden-repuestos.component.html',
  styleUrls: ['./orden-repuestos.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    IonCard, IonCardContent, IonCardHeader, IonCardTitle,
    IonItem, IonLabel, IonSelect, IonSelectOption, IonInput,
    IonButton, IonIcon, IonList, IonListHeader, IonNote,
    IonBadge
  ]
})
export class OrdenRepuestosComponent implements OnInit {
  @Input() ordenId!: string;
  @Input() items: OrdenItem[] = [];
  @Input() manoObra: number = 0;
  @Input() impuestos: number = 0;

  repuestos: Repuesto[] = [];
  repuestoSeleccionado: string = '';
  cantidad: number = 1;
  total: number = 0;
  subtotalRepuestos: number = 0;

  constructor(
    private ordersService: OrdersService,
    private db: DatabaseService,
    private alertController: AlertController,
    private toastController: ToastController
  ) {
    addIcons({ trash, add });
  }

  async ngOnInit() {
    await this.cargarRepuestos();
    this.calcularTotales();
  }

  async cargarRepuestos() {
    try {
      this.repuestos = await this.db.getRepuestos();
    } catch (error) {
      console.error('Error cargando repuestos:', error);
      await this.mostrarError('Error al cargar repuestos');
    }
  }

  obtenerRepuesto(repuestoId: string): Repuesto | undefined {
    return this.repuestos.find(r => r.id === repuestoId);
  }

  async agregarItem() {
    if (!this.repuestoSeleccionado) {
      await this.mostrarError('Selecciona un repuesto');
      return;
    }

    if (this.cantidad <= 0) {
      await this.mostrarError('La cantidad debe ser mayor a 0');
      return;
    }

    const repuesto = this.obtenerRepuesto(this.repuestoSeleccionado);
    if (!repuesto) {
      await this.mostrarError('Repuesto no encontrado');
      return;
    }

    // validar stock
    if (repuesto.stock < this.cantidad) {
      await this.mostrarError(
        `Stock insuficiente.\nDisponible: ${repuesto.stock}\nSolicitado: ${this.cantidad}`
      );
      return;
    }

    try {
      const nuevoItem: OrdenItem = {
        repuestoId: this.repuestoSeleccionado,
        descripcion: repuesto.nombre,
        cantidad: this.cantidad,
        precioUnitario: repuesto.precio,
        subtotal: repuesto.precio * this.cantidad
      };

      await this.ordersService.addItemConDescuentoStock(
        this.ordenId,
        nuevoItem
      );

      // actualizar items localmente
      this.items.push(nuevoItem);
      this.calcularTotales();

      // resetear formulario
      this.repuestoSeleccionado = '';
      this.cantidad = 1;

      await this.mostrarExito('Repuesto agregado');
    } catch (error: any) {
      await this.mostrarError(error.message || 'Error al agregar repuesto');
    }
  }

  async eliminarItem(itemId: string | undefined) {
    if (!itemId) return;

    const alert = await this.alertController.create({
      header: 'Confirmar',
      message: '¿Eliminar este repuesto de la orden?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: async () => {
            try {
              await this.ordersService.removeItem(this.ordenId, itemId);
              this.items = this.items.filter(i => i.id !== itemId);
              this.calcularTotales();
              await this.mostrarExito('Repuesto eliminado');
            } catch (error) {
              await this.mostrarError('Error al eliminar repuesto');
            }
          }
        }
      ]
    });

    await alert.present();
  }

  calcularTotales() {
    this.subtotalRepuestos = this.items.reduce((t, i) => t + (i.subtotal || 0), 0);
    this.total = this.subtotalRepuestos + this.manoObra + this.impuestos;
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
