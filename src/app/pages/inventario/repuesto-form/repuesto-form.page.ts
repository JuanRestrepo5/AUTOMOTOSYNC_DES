import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle, IonContent,
  IonCard, IonCardContent, IonItem, IonLabel, IonInput, IonTextarea,
  IonButton, IonSpinner, IonText, ToastController
} from '@ionic/angular/standalone';

import { InventarioService } from '../services/inventario.service';
import { Repuesto } from '../../../core/models/repuesto.model';

@Component({
  selector: 'app-repuesto-form',
  templateUrl: './repuesto-form.page.html',
  styleUrls: ['./repuesto-form.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle, IonContent,
    IonCard, IonCardContent, IonItem, IonLabel, IonInput, IonTextarea,
    IonButton, IonSpinner, IonText
  ]
})
export class RepuestoFormPage implements OnInit {
  repuestoForm: FormGroup;
  isEditMode = false;
  repuestoId?: string;
  loading = false;

constructor(
    private fb: FormBuilder,
    private inventarioService: InventarioService,
    private router: Router,
    private route: ActivatedRoute,
    private toastController: ToastController
  ) {
    this.repuestoForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      codigo: ['', [Validators.required]],
      descripcion: [''],
      precio: [0, [Validators.required, Validators.min(0)]],
      stock: [0, [Validators.required, Validators.min(0)]],
      stockMinimo: [0, [Validators.required, Validators.min(0)]]
    });
  }

  async ngOnInit() {
    this.repuestoId = this.route.snapshot.paramMap.get('id') || undefined;
    
    if (this.repuestoId) {
      this.isEditMode = true;
      await this.loadRepuesto();
    }
  }

  async loadRepuesto() {
    try {
      const repuesto = await this.inventarioService.getRepuestoById(this.repuestoId!);
      this.repuestoForm.patchValue(repuesto);
    } catch (error) {
      console.error('Error cargando repuesto:', error);
      await this.showToast('Error al cargar el repuesto', 'danger');
    }
  }

  async onSubmit() {
    if (this.repuestoForm.invalid) {
      await this.showToast('Por favor complete todos los campos requeridos', 'warning');
      return;
    }

    this.loading = true;

    try {
      const repuestoData = this.repuestoForm.value;

      if (this.isEditMode && this.repuestoId) {
        await this.inventarioService.updateRepuesto(this.repuestoId, repuestoData);
        await this.showToast('Repuesto actualizado exitosamente', 'success');
      } else {
        await this.inventarioService.createRepuesto(repuestoData);
        await this.showToast('Repuesto creado exitosamente', 'success');
      }

      this.router.navigate(['/inventario']);
    } catch (error) {
      console.error('Error guardando repuesto:', error);
      await this.showToast('Error al guardar el repuesto', 'danger');
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
    this.router.navigate(['/inventario']);
  }
}