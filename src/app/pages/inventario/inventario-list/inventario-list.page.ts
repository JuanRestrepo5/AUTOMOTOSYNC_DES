import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import {
  IonHeader, IonToolbar, IonButtons, IonMenuButton, IonTitle, IonContent,
  IonButton, IonIcon, IonCard, IonCardHeader, IonCardTitle, IonCardContent,
  IonList, IonItem, IonLabel, IonBadge, IonSpinner, AlertController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { addCircleOutline, createOutline, trashOutline, warningOutline } from 'ionicons/icons';

import { InventarioService } from '../services/inventario.service';
import { Repuesto } from '../../../core/models/repuesto.model';

@Component({
  selector: 'app-inventario-list',
  templateUrl: './inventario-list.page.html',
  styleUrls: ['./inventario-list.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    IonHeader, IonToolbar, IonButtons, IonMenuButton, IonTitle, IonContent,
    IonButton, IonIcon, IonCard, IonCardHeader, IonCardTitle, IonCardContent,
    IonList, IonItem, IonLabel, IonBadge, IonSpinner
  ]
})
export class InventarioListPage implements OnInit {
  repuestos: Repuesto[] = [];
  loading = true;

  constructor(
    private inventarioService: InventarioService,
    private router: Router,
    private alertController: AlertController
  ) {
    this.registerIcons();
  }

  private registerIcons() {
    addIcons({
      'add-circle-outline': addCircleOutline,
      'create-outline': createOutline,
      'trash-outline': trashOutline,
      'warning-outline': warningOutline
    });
  }

  async ngOnInit() {
    await this.loadRepuestos();
  }

  async ionViewWillEnter() {
    await this.loadRepuestos();
  }

  async loadRepuestos() {
    this.loading = true;
    try {
      this.repuestos = await this.inventarioService.getRepuestos();
    } catch (error) {
      console.error('Error cargando repuestos:', error);
    } finally {
      this.loading = false;
    }
  }

  goToNuevoRepuesto() {
    this.router.navigate(['/inventario/nuevo']);
  }

  goToEditar(repuesto: Repuesto, event: Event) {
    event.stopPropagation();
    this.router.navigate(['/inventario/editar', repuesto.id]);
  }

  async confirmarEliminar(repuesto: Repuesto, event: Event) {
    event.stopPropagation();
    
    const alert = await this.alertController.create({
      header: 'Confirmar eliminación',
      message: `¿Está seguro de eliminar ${repuesto.nombre}?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: async () => {
            await this.eliminarRepuesto(repuesto);
          }
        }
      ]
    });

    await alert.present();
  }

  async eliminarRepuesto(repuesto: Repuesto) {
    try {
      await this.inventarioService.deleteRepuesto(repuesto.id!);
      await this.loadRepuestos();
    } catch (error) {
      console.error('Error eliminando repuesto:', error);
    }
  }

  isStockBajo(repuesto: Repuesto): boolean {
    return this.inventarioService.isStockBajo(repuesto);
  }

  getStockColor(repuesto: Repuesto): string {
    return this.isStockBajo(repuesto) ? 'danger' : 'success';
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0
    }).format(value);
  }
}