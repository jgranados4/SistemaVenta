import {
  ApplicationConfig,
  inject,
  LOCALE_ID,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import {
  provideHttpClient,
  withFetch,
  withInterceptors,
} from '@angular/common/http';
import { errorInterceptor } from '@core/interceptors/error.interceptor';
import { ThemeService } from '@core/services';
import { MAT_DATE_LOCALE, provideNativeDateAdapter } from '@angular/material/core';
import localeEsEc from '@angular/common/locales/es-EC';
import { registerLocaleData } from '@angular/common';
registerLocaleData(localeEsEc, 'es-EC');
export const GLOBAL_DATE_FORMATS = {
  parse: {
    dateInput: 'DD/MM/YYYY',
  },
  display: {
    dateInput: 'dd/MM/yyyy', // Formato visual (Angular DatePipe syntax)
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};
export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideHttpClient(withFetch(), withInterceptors([errorInterceptor])),
    provideAppInitializer(() => {
      const themeService = inject(ThemeService);
      themeService.init();
    }),
    { provide: MAT_DATE_LOCALE, useValue: 'es-EC' },
    provideNativeDateAdapter(),
    { provide: LOCALE_ID, useValue: 'es-EC' },
  ],
};
