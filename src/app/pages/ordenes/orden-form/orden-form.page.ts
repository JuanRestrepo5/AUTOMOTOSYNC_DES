import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle, IonContent,
  IonCard, IonCardContent, IonItem, IonLabel, IonInput, IonSelect,
  IonSelectOption, IonTextarea, IonButton, IonSpinner, IonText,
  IonDatetime, ToastController
} from '@ionic/angular/standalone';

import { OrdenesService } from '../services/ordenes.service';
import { ClientesService } from '../../clientes/services/clientes.service';
import { VehiculosService } from '../../vehiculos/services/vehiculos.service';
import { Orden } from '../../../core/models/orden.model';
import { Cliente } from '../../../core/models/cliente.model';
import { Vehiculo } from '../../../core/models/vehiculo.model';

@Component({
  selector: 'app-orden-form',
  templateUrl: './orden-form.page.html',
  styleUrls: ['./orden-form.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle, IonContent,
    IonCard, IonCardContent, IonItem, IonLabel, IonInput, IonSelect,
    IonSelectOption, IonTextarea, IonButton, IonSpinner, IonText, IonDatetime
  ]
})
export class OrdenFormPage implements OnInit {
  ordenForm: FormGroup;
  isEditMode = false;
  ordenId?: string;
  loading = false;
  clientes: Cliente[] = [];
  vehiculos: Vehiculo[] = [];
  vehiculosFiltrados: Vehiculo[] = [];

  constructor(
    private fb: FormBuilder,
    private ordenesService: OrdenesService,
    private clientesService: ClientesService,
    private vehiculosService: VehiculosService,
    private router: Router,
    private route: ActivatedRoute,
    private toastController: ToastController
  ) {
    this.ordenForm = this.fb.group({
      clienteId: ['', [Validators.required]],
      vehiculoId: ['', [Validators.required]],
      descripcion: ['', [Validators.required, Validators.minLength(10)]],
      fechaServicio: [new Date().toISOString(), [Validators.required]],
      mecanicoAsignado: [''],
      observaciones: ['']
    });
  }

  async ngOnInit() {
    await this.loadClientes();
    await this.loadVehiculos();
    
    this.ordenId = this.route.snapshot.paramMap.get('id') || undefined;
    
    if (this.ordenId) {
      this.isEditMode = true;
      await this.loadOrden();
    }

    this.ordenForm.get('clienteId')?.valueChanges.subscribe(clienteId => {
      this.filtrarVehiculosPorCliente(clienteId);
    });
  }

  async loadClientes() {
    try {
      this.clientes = await this.clientesService.getClientes();
    } catch (error) {
      console.error('Error cargando clientes:', error);
    }
  }

  async loadVehiculos() {
    try {
      this.vehiculos = await this.vehiculosService.getVehiculos();
    } catch (error) {
      console.error('Error cargando vehículos:', error);
    }
  }

  filtrarVehiculosPorCliente(clienteId: string) {
    if (!clienteId) {
      this.vehiculosFiltrados = [];
      this.ordenForm.get('vehiculoId')?.setValue('');
      return;
    }
    
    this.vehiculosFiltrados = this.vehiculos.filter(v => v.clienteId === clienteId);
    
    if (this.vehiculosFiltrados.length === 0) {
      this.ordenForm.get('vehiculoId')?.setValue('');
    }
  }

  async loadOrden() {
    try {
      const orden = await this.ordenesService.getOrdenById(this.ordenId!);
      this.ordenForm.patchValue({
        ...orden,
        fechaServicio: new Date(orden.fechaServicio).toISOString()
      });
      
      this.filtrarVehiculosPorCliente(orden.clienteId);
    } catch (error) {
      console.error('Error cargando orden:', error);
      await this.showToast('Error al cargar la orden', 'danger');
    }
  }

  async onSubmit() {
    if (this.ordenForm.invalid) {
      await this.showToast('Por favor complete todos los campos requeridos', 'warning');
      return;
    }

    this.loading = true;

    try {
      const ordenData = {
        ...this.ordenForm.value,
        fechaServicio: new Date(this.ordenForm.value.fechaServicio)
      };

      if (this.isEditMode && this.ordenId) {
        await this.ordenesService.updateOrden(this.ordenId, ordenData);
        await this.showToast('Orden actualizada exitosamente', 'success');
      } else {
        await this.ordenesService.createOrden(ordenData);
        await this.showToast('Orden creada exitosamente', 'success');
      }

      this.router.navigate(['/ordenes']);
    } catch (error) {
      console.error('Error guardando orden:', error);
      await this.showToast('Error al guardar la orden', 'danger');
    } finally {
      this.loading = false;
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

  goBack() {
    this.router.navigate(['/ordenes']);
  }
}