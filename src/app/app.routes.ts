import { Routes } from '@angular/router';
import { AuthGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'splash',
    pathMatch: 'full'
  },
  {
    path: 'splash',
    loadComponent: () => import('./pages/splash/splash.page').then(m => m.SplashPage)
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/auth/login/login.page').then(m => m.LoginPage)
  },
  {
    path: 'registro',
    loadComponent: () => import('./pages/auth/registro/registro.page').then(m => m.RegistroPage)
  },
  {
    path: 'recuperar',
    loadComponent: () => import('./pages/auth/recuperar/recuperar.page').then(m => m.RecuperarPage)
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./pages/dashboard/dashboard.page').then(m => m.DashboardPage),
    canActivate: [AuthGuard]
  },
  {
    path: 'clientes',
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        loadComponent: () => import('./pages/clientes/clientes-list/clientes-list.page').then(m => m.ClientesListPage)
      },
      {
        path: 'nuevo',
        loadComponent: () => import('./pages/clientes/cliente-form/cliente-form.page').then(m => m.ClienteFormPage)
      },
      {
        path: 'editar/:id',
        loadComponent: () => import('./pages/clientes/cliente-form/cliente-form.page').then(m => m.ClienteFormPage)
      }
    ]
  },
  {
    path: 'vehiculos',
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        loadComponent: () => import('./pages/vehiculos/vehiculos-list/vehiculos-list.page').then(m => m.VehiculosListPage)
      },
      {
        path: 'nuevo',
        loadComponent: () => import('./pages/vehiculos/vehiculo-form/vehiculo-form.page').then(m => m.VehiculoFormPage)
      },
      {
        path: 'editar/:id',
        loadComponent: () => import('./pages/vehiculos/vehiculo-form/vehiculo-form.page').then(m => m.VehiculoFormPage)
      }
    ]
  },
  {
    path: 'ordenes',
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        loadComponent: () => import('./pages/ordenes/ordenes-list/ordenes-list.page').then(m => m.OrdenesListPage)
      },
      {
        path: 'nueva',
        loadComponent: () => import('./pages/ordenes/orden-form/orden-form.page').then(m => m.OrdenFormPage)
      },
      {
        path: 'editar/:id',
        loadComponent: () => import('./pages/ordenes/orden-form/orden-form.page').then(m => m.OrdenFormPage)
      }
    ]
  },
  {
    path: 'inventario',
    canActivate: [AuthGuard],
    children: [
      {
        path: '',
        loadComponent: () => import('./pages/inventario/inventario-list/inventario-list.page').then(m => m.InventarioListPage)
      },
      {
        path: 'nuevo',
        loadComponent: () => import('./pages/inventario/repuesto-form/repuesto-form.page').then(m => m.RepuestoFormPage)
      },
      {
        path: 'editar/:id',
        loadComponent: () => import('./pages/inventario/repuesto-form/repuesto-form.page').then(m => m.RepuestoFormPage)
      }
    ]
  },
  {
    path: 'configuracion',
    loadComponent: () => import('./pages/configuracion/configuracion.page').then(m => m.ConfiguracionPage),
    canActivate: [AuthGuard]
  }
];
