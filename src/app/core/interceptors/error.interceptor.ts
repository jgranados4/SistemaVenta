import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { showAlert } from '@core/interface';
import { catchError, throwError } from 'rxjs';
import { environment } from 'src/environments/environment.development';

let isAlertShown = false;
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 0) {
        console.log('boleano', isAlertShown);
        if (!isAlertShown) {
          isAlertShown = true;
          showAlert(
            'No Internet Connection',
            'Please check your connection.',
            'error',
            {timer:environment.ALERT_DEBOUNCE_TIME}
          ).then(() => (isAlertShown = false));
        }
        // Client side error
      } else {
        // Server side error
        switch (error.status) {
          case 401:
            showAlert('Sesión Expirada',
          'Por favor inicia sesión nuevamente.',
          'warning',);
            break;
          case 403:
            showAlert(
             'Acceso Denegado',
          'No tienes permisos para realizar esta acción.',
          'error',
            );
            break;
          case 404:
            showAlert(
              'Not Found',
              'The requested resource could not be found.',
              'info'
            );
            break;
          case 500:
            showAlert(
             'Error del Servidor',
          'Algo salió mal en el servidor. Intenta más tarde.',
          'error',
            );
            break;
          default:
            showAlert(
              'Unexpected Error',
              'An unexpected error occurred. Please try again.',
              'error'
            );
        }
        console.error(`HTTP Error ${error.status}:`, error.message);
      }
      return throwError(() => error);
    })
  );
};
