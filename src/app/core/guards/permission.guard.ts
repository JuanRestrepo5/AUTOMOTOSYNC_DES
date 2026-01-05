import { Injectable } from '@angular/core';
import { CanActivate, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { authState } from '@angular/fire/auth';
import { Auth } from '@angular/fire/auth';
import { RoleService } from '../services/role.service';
import { Permission } from '../models/role.model';

/**
 * Guard para verificar permisos específicos
 * Uso: canActivate: [PermissionGuard]
 *      data: { requiredPermission: Permission.VIEW_ORDENES }
 */
@Injectable({
  providedIn: 'root'
})
export class PermissionGuard implements CanActivate {
  constructor(
    private roleService: RoleService,
    private router: Router,
    private auth: Auth
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return authState(this.auth).pipe(
      take(1),
      map(user => {
        if (!user) {
          this.router.navigate(['/login']);
          return false;
        }

        const requiredPermission = route.data['requiredPermission'] as Permission;
        
        if (!requiredPermission) {
          return true;
        }

        if (this.roleService.hasPermission(requiredPermission)) {
          return true;
        }

        console.warn(`Acceso denegado. Permiso requerido: ${requiredPermission}`);
        this.router.navigate(['/dashboard'], { 
          queryParams: { message: 'No tienes permisos para acceder a esta sección' }
        });
        return false;
      })
    );
  }
}
