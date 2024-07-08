import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./componentes/login/login.component').then(
        (m) => m.LoginComponent
      ),
    pathMatch: 'full',
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./componentes/login/login.component').then(
        (m) => m.LoginComponent
      ),
    pathMatch: 'full',
  },
  {
    path: 'pages',
    loadChildren: () => import('./componentes/layout/layout.routes'),
  },
  {
    path: '**',
    redirectTo: 'login',
    pathMatch: 'full',
  },
];
