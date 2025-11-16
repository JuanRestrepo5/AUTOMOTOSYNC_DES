import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import {
  IonHeader, IonToolbar, IonButtons, IonMenuButton, IonTitle, IonContent,
  IonSegment, IonSegmentButton, IonLabel, IonButton, IonIcon, IonCard,
  IonCardHeader, IonCardTitle, IonCardContent, IonList, IonItem,
  IonBadge, IonSpinner, ActionSheetController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { 
  addCircleOutline, createOutline, swapHorizontalOutline,
  timeOutline, constructOutline, checkmarkCircleOutline
} from 'ionicons/icons';

import { OrdenesService } from '../services/ordenes.service';
import { ClientesService } from '../../clientes/services/clientes.service';
import { VehiculosService } from '../../vehiculos/services/vehiculos.service';
import { Orden, EstadoOrden } from '../../../core/models/orden.model';

@Component({
  selector: 'app-ordenes-list',
  templateUrl: './ordenes-list.page.html',
  styleUrls: ['./ordenes-list.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    IonHeader, IonToolbar, IonButtons, IonMenuButton, IonTitle, IonContent,
    IonSegment, IonSegmentButton, IonLabel, IonButton, IonIcon, IonCard,
    IonCardHeader, IonCardTitle, IonCardContent, IonList, IonItem,
    IonBadge, IonSpinner
  ]
})
export class OrdenesListPage implements OnInit {
  ordenes: any[] = [];
  ordenesFiltradas: any[] = [];
  loading = true;
  filtroEstado: EstadoOrden | 'todas' = 'todas';

  constructor(
    private ordenesService: OrdenesService,
    private clientesService: ClientesService,
    private vehiculosService: VehiculosService,
    private router: Router,
    private actionSheetController: ActionSheetController
  ) {
    this.registerIcons();
  }

  private registerIcons() {
    addIcons({
      'add-circle-outline': addCircleOutline,
      'create-outline': createOutline,
      'swap-horizontal-outline': swapHorizontalOutline,
      'time-outline': timeOutline,
      'construct-outline': constructOutline,
      'checkmark-circle-outline': checkmarkCircleOutline
    });
  }

  async ngOnInit() {
    await this.loadOrdenes();
  }

  async ionViewWillEnter() {
    await this.loadOrdenes();
  }

  async loadOrdenes() {
    this.loading = true;
    try {
      const ordenes = await this.ordenesService.getOrdenes();
      
      this.ordenes = await Promise.all(
        ordenes.map(async (orden) => {
          const cliente = await this.clientesService.getClienteById(orden.clienteId);
          const vehiculo = await this.vehiculosService.getVehiculoById(orden.vehiculoId);
          return {
            ...orden,
            clienteNombre: cliente?.nombre || 'Cliente no encontrado',
            vehiculoPlaca: vehiculo?.placa || 'N/A',
            vehiculoInfo: `${vehiculo?.marca} ${vehiculo?.modelo}`
          };
        })
      );
      
      this.aplicarFiltro();
    } catch (error) {
      console.error('Error cargando órdenes:', error);
    } finally {
      this.loading = false;
    }
  }

  aplicarFiltro() {
    if (this.filtroEstado === 'todas') {
      this.ordenesFiltradas = [...this.ordenes];
    } else {
      this.ordenesFiltradas = this.ordenes.filter(o => o.estado === this.filtroEstado);
    }
    
    this.ordenesFiltradas.sort((a, b) => 
      new Date(b.fechaCreacion).getTime() - new Date(a.fechaCreacion).getTime()
    );
  }

  cambiarFiltro(event: any) {
    this.filtroEstado = event.detail.value;
    this.aplicarFiltro();
  }

  goToNuevaOrden() {
    this.router.navigate(['/ordenes/nueva']);
  }

  goToDetalle(orden: any) {
    this.router.navigate(['/ordenes/detalle', orden.id]);
  }

  async cambiarEstado(orden: any, event: Event) {
    event.stopPropagation();
    
    const actionSheet = await this.actionSheetController.create({
      header: 'Cambiar estado de orden',
      buttons: [
        {
          text: 'Pendiente',
          icon: 'time-outline',
          handler: () => this.updateEstado(orden.id, 'pendiente')
        },
        {
          text: 'En Proceso',
          icon: 'construct-outline',
          handler: () => this.updateEstado(orden.id, 'en_proceso')
        },
        {
          text: 'Finalizado',
          icon: 'checkmark-circle-outline',
          handler: () => this.updateEstado(orden.id, 'finalizado')
        },
        {
          text: 'Cancelar',
          icon: 'close',
          role: 'cancel'
        }
      ]
    });

    await actionSheet.present();
  }

  async updateEstado(ordenId: string, nuevoEstado: EstadoOrden) {
    try {
      await this.ordenesService.updateEstado(ordenId, nuevoEstado);
      await this.loadOrdenes();
    } catch (error) {
      console.error('Error actualizando estado:', error);
    }
  }

  getEstadoBadgeClass(estado: EstadoOrden): string {
    return this.ordenesService.getEstadoBadgeClass(estado);
  }

  getEstadoLabel(estado: EstadoOrden): string {
    return this.ordenesService.getEstadoLabel(estado);
  }

  getEstadoColor(estado: EstadoOrden): string {
    const colors = {
      'pendiente': 'warning',
      'en_proceso': 'primary',
      'finalizado': 'success'
    };
    return colors[estado] || 'medium';
  }
}