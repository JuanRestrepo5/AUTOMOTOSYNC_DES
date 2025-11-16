import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import {
  IonHeader, IonToolbar, IonButtons, IonMenuButton, IonTitle, IonContent,
  IonSearchbar, IonButton, IonIcon, IonCard, IonCardHeader, IonCardTitle,
  IonCardContent, IonList, IonItem, IonLabel, IonSpinner,
  AlertController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { addCircleOutline, createOutline, trashOutline } from 'ionicons/icons';

import { ClientesService } from '../services/clientes.service';
import { Cliente } from '../../../core/models/cliente.model';

@Component({
  selector: 'app-clientes-list',
  templateUrl: './clientes-list.page.html',
  styleUrls: ['./clientes-list.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    IonHeader, IonToolbar, IonButtons, IonMenuButton, IonTitle, IonContent,
    IonSearchbar, IonButton, IonIcon, IonCard, IonCardHeader, IonCardTitle,
    IonCardContent, IonList, IonItem, IonLabel, IonSpinner
  ]
})
export class ClientesListPage implements OnInit {
  clientes: Cliente[] = [];
  clientesFiltrados: Cliente[] = [];
  searchQuery = '';
  loading = true;

  constructor(
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
      'trash-outline': trashOutline
    });
  }

  async ngOnInit() {
    await this.loadClientes();
  }

  async ionViewWillEnter() {
    await this.loadClientes();
  }

  async loadClientes() {
    this.loading = true;
    try {
      this.clientes = await this.clientesService.getClientes();
      this.clientesFiltrados = [...this.clientes];
    } catch (error) {
      console.error('Error cargando clientes:', error);
    } finally {
      this.loading = false;
    }
  }

  async searchClientes(event: any) {
    this.searchQuery = event.target.value;
    
    if (!this.searchQuery || this.searchQuery.trim() === '') {
      this.clientesFiltrados = [...this.clientes];
      return;
    }

    try {
      this.clientesFiltrados = await this.clientesService.searchClientes(this.searchQuery);
    } catch (error) {
      console.error('Error buscando clientes:', error);
    }
  }

  goToNuevoCliente() {
    this.router.navigate(['/clientes/nuevo']);
  }

  goToDetalle(cliente: Cliente) {
    this.router.navigate(['/clientes/detalle', cliente.id]);
  }

  goToEditar(cliente: Cliente, event: Event) {
    event.stopPropagation();
    this.router.navigate(['/clientes/editar', cliente.id]);
  }

  async confirmarEliminar(cliente: Cliente, event: Event) {
    event.stopPropagation();
    
    const alert = await this.alertController.create({
      header: 'Confirmar eliminación',
      message: `¿Está seguro de eliminar a ${cliente.nombre}?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel'
        },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: async () => {
            await this.eliminarCliente(cliente);
          }
        }
      ]
    });

    await alert.present();
  }

  async eliminarCliente(cliente: Cliente) {
    try {
      await this.clientesService.deleteCliente(cliente.id!);
      await this.loadClientes();
    } catch (error) {
      console.error('Error eliminando cliente:', error);
    }
  }
}