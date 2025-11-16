import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import {
  IonContent, IonCard, IonCardContent, IonItem, IonIcon, IonInput,
  IonButton, IonText, ToastController
} from '@ionic/angular/standalone';
import { addIcons } from 'ionicons';
import { mailOutline } from 'ionicons/icons';

import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-recuperar',
  templateUrl: './recuperar.page.html',
  styleUrls: ['./recuperar.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterModule,
    IonContent, IonCard, IonCardContent, IonItem, IonIcon, IonInput,
    IonButton, IonText
  ]
})
export class RecuperarPage {
  recuperarForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private toastController: ToastController
  ) {
    this.registerIcons();
    this.recuperarForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  private registerIcons() {
    addIcons({
      'mail-outline': mailOutline
    });
  }

  async onSubmit() {
    if (this.recuperarForm.invalid) {
      await this.showToast('Por favor ingrese un correo válido', 'warning');
      return;
    }

    try {
      const { email } = this.recuperarForm.value;
      await this.authService.resetPassword(email);
      
      await this.showToast('✓ Correo de recuperación enviado', 'success');
      this.router.navigate(['/login']);
    } catch (error) {
      console.error('Error:', error);
      await this.showToast('Error al enviar el correo', 'danger');
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