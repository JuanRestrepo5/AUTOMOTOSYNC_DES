import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {
  Auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
  User,
  authState
} from '@angular/fire/auth';
import { firstValueFrom } from 'rxjs';
import { setPersistence, browserSessionPersistence } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(
    private auth: Auth,
    private router: Router
  ) {}

  async login(email: string, password: string): Promise<any> {
    try {
      // ⚡ Persistencia temporal: la sesión se pierde al cerrar la app
      await setPersistence(this.auth, browserSessionPersistence);

      const result = await signInWithEmailAndPassword(this.auth, email, password);
      this.router.navigate(['/dashboard']);
      return result;
    } catch (error) {
      throw error;
    }
  }

  async register(email: string, password: string): Promise<any> {
    try {
      const result = await createUserWithEmailAndPassword(this.auth, email, password);
      return result;
    } catch (error) {
      throw error;
    }
  }

  async resetPassword(email: string): Promise<void> {
    await sendPasswordResetEmail(this.auth, email);
  }

  async logout(): Promise<void> {
    await signOut(this.auth);
    await this.router.navigate(['/login']);
  }

  // -----------------------
  // Get current user (correcto para AngularFire)
  // -----------------------
  async getCurrentUser(): Promise<User | null> {
    // authState(this.auth) es un Observable que respeta AngularFire
    // firstValueFrom toma el primer valor y completa
    return firstValueFrom(authState(this.auth));
  }

  // booleano si hace falta
  async isAuthenticated(): Promise<boolean> {
    const user = await this.getCurrentUser();
    return !!user;
  }
/*
  async logoutSilencioso(): Promise<void> {
    try {
      await signOut(this.auth);
    } catch (error) {
      console.error('Error al cerrar sesión silenciosamente:', error);
    }
  }
    */

}
