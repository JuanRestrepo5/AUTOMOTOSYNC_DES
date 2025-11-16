import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import {
  IonHeader, IonToolbar, IonButtons, IonMenuButton, IonTitle, IonContent,
  IonButton, IonIcon, IonCard, IonCardHeader, IonCardTitle, IonCardContent,
  IonList, IonItem, IonLabel, IonBadge, IonSpinner, AlertController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { addCircleOutline, createOutline, trashOutline, listOutline } from 'ionicons/icons';

import { VehiculosService } from '../services/vehiculos.service';
import { ClientesService } from '../../clientes/services/clientes.service';
import { Vehiculo } from '../../../core/models/vehiculo.model';

@Component({
  selector: 'app-vehiculos-list',
  templateUrl: './vehiculos-list.page.html',
  styleUrls: ['./vehiculos-list.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    IonHeader, IonToolbar, IonButtons, IonMenuButton, IonTitle, IonContent,
    IonButton, IonIcon, IonCard, IonCardHeader, IonCardTitle, IonCardContent,
    IonList, IonItem, IonLabel, IonBadge, IonSpinner
  ]
})
export class VehiculosListPage implements OnInit {
  vehiculos: any[] = [];
  loading = true;

  constructor(
    private vehiculosService: VehiculosService,
    private clientesService: ClientesService,
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
      'list-outline': listOutline
    });
  }

  async ngOnInit() {
    await this.loadVehiculos();
  }

  async ionViewWillEnter() {
    await this.loadVehiculos();
  }

  async loadVehiculos() {
    this.loading = true;
    try {
      const vehiculos = await this.vehiculosService.getVehiculos();
      
      this.vehiculos = await Promise.all(
        vehiculos.map(async (vehiculo) => {
          const cliente = await this.clientesService.getClienteById(vehiculo.clienteId);
          const historial = await this.vehiculosService.getHistorialServicios(vehiculo.id!);
          return {
            ...vehiculo,
            clienteNombre: cliente?.nombre || 'Cliente no encontrado',
            cantidadServicios: historial.length
          };
        })
      );
    } catch (error) {
      console.error('Error cargando vehículos:', error);
    } finally {
      this.loading = false;
    }
  }

  goToNuevoVehiculo() {
    this.router.navigate(['/vehiculos/nuevo']);
  }

  goToDetalle(vehiculo: any) {
    this.router.navigate(['/vehiculos/detalle', vehiculo.id]);
  }

  goToEditar(vehiculo: any, event: Event) {
    event.stopPropagation();
    this.router.navigate(['/vehiculos/editar', vehiculo.id]);
  }

  async verHistorial(vehiculo: any, event: Event) {
    event.stopPropagation();
    this.router.navigate(['/vehiculos/historial', vehiculo.id]);
  }

  async confirmarEliminar(vehiculo: any, event: Event) {
    event.stopPropagation();
    
    const alert = await this.alertController.create({
      header: 'Confirmar eliminación',
      message: `¿Está seguro de eliminar el vehículo ${vehiculo.placa}?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: async () => {
            await this.eliminarVehiculo(vehiculo);
          }
        }
      ]
    });

    await alert.present();
  }

  async eliminarVehiculo(vehiculo: any) {
    try {
      await this.vehiculosService.deleteVehiculo(vehiculo.id);
      await this.loadVehiculos();
    } catch (error) {
      console.error('Error eliminando vehículo:', error);
    }
  }
}