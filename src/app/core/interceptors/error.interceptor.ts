import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpRequest, HttpHandler, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, retry } from 'rxjs/operators';
import { ToastController } from '@ionic/angular';

/**
 * Interceptor HTTP global
 * Maneja errores de red y proporciona reintentos automáticos
 */
@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
  constructor(private toastController: ToastController) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(request).pipe(
      // Reintentar automáticamente en caso de error (máximo 2 reintentos)
      retry({
        count: 2,
        delay: 1000
      }),
      catchError((error: HttpErrorResponse) => {
        let errorMessage = 'Error en la solicitud';

        if (error.error instanceof ErrorEvent) {
          // Error del cliente
          errorMessage = `Error: ${error.error.message}`;
        } else {
          // Error del servidor
          switch (error.status) {
            case 400:
              errorMessage = 'Solicitud inválida';
              break;
            case 401:
              errorMessage = 'No autorizado. Por favor inicia sesión';
              break;
            case 403:
              errorMessage = 'Acceso denegado';
              break;
            case 404:
              errorMessage = 'Recurso no encontrado';
              break;
            case 500:
              errorMessage = 'Error del servidor';
              break;
            case 503:
              errorMessage = 'Servicio no disponible';
              break;
            default:
              errorMessage = `Error ${error.status}: ${error.statusText}`;
          }
        }

        console.error('Error HTTP:', errorMessage, error);
        this.showErrorToast(errorMessage);

        return throwError(() => new Error(errorMessage));
      })
    );
  }

  private async showErrorToast(message: string): Promise<void> {
    const toast = await this.toastController.create({
      message,
      duration: 3000,
      position: 'bottom',
      color: 'danger'
    });
    await toast.present();
  }
}
