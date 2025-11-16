import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle, IonContent,
  IonCard, IonCardContent, IonItem, IonLabel, IonInput, IonSelect,
  IonSelectOption, IonButton, IonSpinner, IonText, ToastController
} from '@ionic/angular/standalone';

import { VehiculosService } from '../services/vehiculos.service';
import { ClientesService } from '../../clientes/services/clientes.service';
import { Vehiculo } from '../../../core/models/vehiculo.model';
import { Cliente } from '../../../core/models/cliente.model';

@Component({
  selector: 'app-vehiculo-form',
  templateUrl: './vehiculo-form.page.html',
  styleUrls: ['./vehiculo-form.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle, IonContent,
    IonCard, IonCardContent, IonItem, IonLabel, IonInput, IonSelect,
    IonSelectOption, IonButton, IonSpinner, IonText
  ]
})
export class VehiculoFormPage implements OnInit {
  vehiculoForm: FormGroup;
  isEditMode = false;
  vehiculoId?: string;
  loading = false;
  clientes: Cliente[] = [];
  
  tiposVehiculo = [
    { value: 'motocicleta', label: 'Motocicleta' },
    { value: 'automovil', label: 'Automóvil' },
    { value: 'camioneta', label: 'Camioneta' },
    { value: 'camion', label: 'Camión' }
  ];

  constructor(
    private fb: FormBuilder,
    private vehiculosService: VehiculosService,
    private clientesService: ClientesService,
    private router: Router,
    private route: ActivatedRoute,
    private toastController: ToastController
  ) {
    this.vehiculoForm = this.fb.group({
      placa: ['', [Validators.required, Validators.pattern(/^[A-Z0-9]{6}$/)]],
      marca: ['', [Validators.required]],
      modelo: ['', [Validators.required]],
      anio: ['', [Validators.required, Validators.min(1900), Validators.max(new Date().getFullYear() + 1)]],
      tipo: ['motocicleta', [Validators.required]],
      clienteId: ['', [Validators.required]]
    });
  }

  async ngOnInit() {
    await this.loadClientes();
    
    this.vehiculoId = this.route.snapshot.paramMap.get('id') || undefined;
    
    if (this.vehiculoId) {
      this.isEditMode = true;
      await this.loadVehiculo();
    }
  }

  async loadClientes() {
    try {
      this.clientes = await this.clientesService.getClientes();
    } catch (error) {
      console.error('Error cargando clientes:', error);
    }
  }

  async loadVehiculo() {
    try {
      const vehiculo = await this.vehiculosService.getVehiculoById(this.vehiculoId!);
      this.vehiculoForm.patchValue(vehiculo);
    } catch (error) {
      console.error('Error cargando vehículo:', error);
      await this.showToast('Error al cargar el vehículo', 'danger');
    }
  }

  async onSubmit() {
    if (this.vehiculoForm.invalid) {
      await this.showToast('Por favor complete todos los campos requeridos', 'warning');
      return;
    }

    this.loading = true;

    try {
      const vehiculoData = this.vehiculoForm.value;

      if (this.isEditMode && this.vehiculoId) {
        await this.vehiculosService.updateVehiculo(this.vehiculoId, vehiculoData);
        await this.showToast('Vehículo actualizado exitosamente', 'success');
      } else {
        await this.vehiculosService.createVehiculo(vehiculoData);
        await this.showToast('Vehículo creado exitosamente', 'success');
      }

      this.router.navigate(['/vehiculos']);
    } catch (error) {
      console.error('Error guardando vehículo:', error);
      await this.showToast('Error al guardar el vehículo', 'danger');
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
    this.router.navigate(['/vehiculos']);
  }
}