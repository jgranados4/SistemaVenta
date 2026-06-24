import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./componentes/landing-page/landing-page'),
  },
  {
    path: 'login',
    loadComponent: () =>
      import('./componentes/login/login.component').then(
        (m) => m.LoginComponent,
      ),
  },
  {
    path: 'registro-empresa',
    title:'registro',
    loadComponent: () =>
      import('./componentes/registro-empresa/registro-empresa').then(
        (r) => r.RegistroEmpresaComponent,
      ),
  },
  {
    path: 'pages',
    loadChildren: () => import('./componentes/layout/layout.routes'),
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full',
  },
];
