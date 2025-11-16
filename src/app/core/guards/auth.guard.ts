import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const AuthGuard = async () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  try {
    const user = await authService.getCurrentUser();
    
    if (user) {
      return true;
    } else {
      router.navigate(['/login'], { replaceUrl: true });
      return false;
    }
  } catch (error) {
    console.error('Error en AuthGuard:', error);
    router.navigate(['/login'], { replaceUrl: true });
    return false;
  }
};