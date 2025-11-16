import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import {
  IonContent, IonCard, IonCardContent, IonItem, IonIcon, IonInput,
  IonButton, IonLabel, IonText, IonSelect, IonSelectOption,
  LoadingController, ToastController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { mailOutline, lockClosedOutline, personOutline } from 'ionicons/icons';

import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    IonContent, IonCard, IonCardContent, IonItem, IonIcon, IonInput,
    IonButton, IonLabel, IonText, IonSelect, IonSelectOption
  ]
})
export class RegistroPage {
  registroForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private loadingController: LoadingController,
    private toastController: ToastController
  ) {
    this.registerIcons();
    this.registroForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]],
      rol: ['Administrador', [Validators.required]]
    });
  }

  private registerIcons() {
    addIcons({
      'mail-outline': mailOutline,
      'lock-closed-outline': lockClosedOutline,
      'person-outline': personOutline
    });
  }

  async onSubmit() {
    if (this.registroForm.invalid) {
      await this.showToast('Por favor complete todos los campos correctamente', 'warning');
      return;
    }

    if (this.registroForm.value.password !== this.registroForm.value.confirmPassword) {
      await this.showToast('Las contraseñas no coinciden', 'warning');
      return;
    }

    const loading = await this.loadingController.create({
      message: 'Creando cuenta...',
    });
    await loading.present();

    try {
      const { email, password } = this.registroForm.value;
      await this.authService.register(email, password);
      
      await loading.dismiss();
      await this.showToast('¡Cuenta creada exitosamente!', 'success');
      this.router.navigate(['/dashboard']);
    } catch (error: any) {
      await loading.dismiss();
      console.error('Error en registro:', error);
      
      let message = 'Error al crear la cuenta';
      if (error.code === 'auth/email-already-in-use') {
        message = 'Este correo ya está registrado';
      }
      
      await this.showToast(message, 'danger');
    }
  }

  goToLogin() {
    this.router.navigate(['/login']);
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
}