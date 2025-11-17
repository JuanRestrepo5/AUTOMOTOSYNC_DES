import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonContent, IonSpinner } from '@ionic/angular/standalone';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-splash',
  templateUrl: './splash.page.html',
  styleUrls: ['./splash.page.scss'],
  standalone: true,
  imports: [IonContent, IonSpinner]
})
export class SplashPage implements OnInit {
  constructor(
    private router: Router,
    private authService: AuthService
  ) {}

  async ngOnInit() {
    console.log('🚀 Splash Screen iniciado');
    
    // Esperar 2 segundos para mostrar la animación
    await this.delay(2000);
    
    console.log('⏰ Verificando autenticación...');
    
    try {
      const user = await this.authService.getCurrentUser();
      
      if (user) {
        console.log('✅ Usuario autenticado, redirigiendo a dashboard');
        // replaceUrl: true elimina el splash del historial
        await this.router.navigate(['/dashboard'], { replaceUrl: true });
      } else {
        console.log('❌ No autenticado, redirigiendo a login');
        await this.router.navigate(['/login'], { replaceUrl: true });
      }
    } catch (error) {
      console.error('❌ Error verificando auth:', error);
      await this.router.navigate(['/login'], { replaceUrl: true });
    }
  }

  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}