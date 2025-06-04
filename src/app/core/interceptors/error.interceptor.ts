import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { showAlert } from '@core/models/utility.Alert';
import { catchError, throwError } from 'rxjs';
import Swal from 'sweetalert2';

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
            'error'
          ).then(() => {
            setTimeout(() => {
              isAlertShown = false;
            }, 5000);
          });
        }
        // Client side error
      } else {
        // Server side error
        switch (error.status) {
          case 401:
            showAlert(
              'Unauthorized',
              'Please log in again.',
              'warning',
              {},
              '/login'
            );
            break;
          case 403:
            showAlert(
              'Forbidden',
              'You do not have permission to perform this action.',
              'error'
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
              'Server Error',
              'Something went wrong on the server.',
              'error'
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
