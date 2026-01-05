import { Injectable } from '@angular/core';
import { UserRole, Permission, hasPermission } from '../models/role.model';
import { AuthService } from './auth.service';

/**
 * Servicio para gestionar roles y permisos
 * Proporciona métodos para verificar permisos de usuario
 */
@Injectable({
  providedIn: 'root'
})
export class RoleService {
  private currentUserRole: UserRole | null = null;

  constructor(private authService: AuthService) {}

  /**
   * Establecer el rol del usuario actual
   */
  async setCurrentUserRole(userId: string): Promise<void> {
    try {
      // TODO: Obtener rol de Firestore cuando se implemente
      // Por ahora, usar rol por defecto (Administrador para demo)
      const user = await this.authService.getCurrentUser();
      if (user) {
        // En producción, esto vendría de Firestore
        this.currentUserRole = UserRole.ADMINISTRADOR;
      }
    } catch (error) {
      console.error('Error al obtener rol del usuario:', error);
      this.currentUserRole = null;
    }
  }

  /**
   * Obtener el rol actual del usuario
   */
  getCurrentRole(): UserRole | null {
    return this.currentUserRole;
  }

  /**
   * Verificar si el usuario actual tiene un permiso específico
   */
  hasPermission(permission: Permission): boolean {
    if (!this.currentUserRole) {
      return false;
    }
    return hasPermission(this.currentUserRole, permission);
  }

  /**
   * Verificar si el usuario actual tiene TODOS los permisos especificados
   */
  hasAllPermissions(permissions: Permission[]): boolean {
    return permissions.every(permission => this.hasPermission(permission));
  }

  /**
   * Verificar si el usuario actual tiene ALGUNO de los permisos especificados
   */
  hasAnyPermission(permissions: Permission[]): boolean {
    return permissions.some(permission => this.hasPermission(permission));
  }

  /**
   * Verificar si el usuario es Administrador
   */
  isAdmin(): boolean {
    return this.currentUserRole === UserRole.ADMINISTRADOR;
  }

  /**
   * Verificar si el usuario es Gerente o superior
   */
  isManager(): boolean {
    return this.currentUserRole === UserRole.ADMINISTRADOR || 
           this.currentUserRole === UserRole.GERENTE;
  }
}
