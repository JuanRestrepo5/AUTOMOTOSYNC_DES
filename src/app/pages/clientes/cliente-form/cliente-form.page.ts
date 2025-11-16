import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle, IonContent,
  IonCard, IonCardContent, IonItem, IonLabel, IonInput, IonTextarea,
  IonButton, IonSpinner, IonText, ToastController
} from '@ionic/angular/standalone';

import { ClientesService } from '../services/clientes.service';
import { Cliente } from '../../../core/models/cliente.model';

@Component({
  selector: 'app-cliente-form',
  templateUrl: './cliente-form.page.html',
  styleUrls: ['./cliente-form.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle, IonContent,
    IonCard, IonCardContent, IonItem, IonLabel, IonInput, IonTextarea,
    IonButton, IonSpinner, IonText
  ]
})
export class ClienteFormPage implements OnInit {
  clienteForm: FormGroup;
  isEditMode = false;
  clienteId?: string;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private clientesService: ClientesService,
    private router: Router,
    private route: ActivatedRoute,
    private toastController: ToastController
  ) {
    this.clienteForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      telefono: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      email: ['', [Validators.email]],
      direccion: [''],
      observaciones: ['']
    });
  }

  async ngOnInit() {
    this.clienteId = this.route.snapshot.paramMap.get('id') || undefined;
    
    if (this.clienteId) {
      this.isEditMode = true;
      await this.loadCliente();
    }
  }

  async loadCliente() {
    try {
      const cliente = await this.clientesService.getClienteById(this.clienteId!);
      this.clienteForm.patchValue(cliente);
    } catch (error) {
      console.error('Error cargando cliente:', error);
      await this.showToast('Error al cargar el cliente', 'danger');
    }
  }

  async onSubmit() {
    if (this.clienteForm.invalid) {
      await this.showToast('Por favor complete todos los campos requeridos', 'warning');
      return;
    }

    this.loading = true;

    try {
      const clienteData = this.clienteForm.value;

      if (this.isEditMode && this.clienteId) {
        await this.clientesService.updateCliente(this.clienteId, clienteData);
        await this.showToast('Cliente actualizado exitosamente', 'success');
      } else {
        await this.clientesService.createCliente(clienteData);
        await this.showToast('Cliente creado exitosamente', 'success');
      }

      this.router.navigate(['/clientes']);
    } catch (error) {
      console.error('Error guardando cliente:', error);
      await this.showToast('Error al guardar el cliente', 'danger');
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
    this.router.navigate(['/clientes']);
  }
}