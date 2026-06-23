import { Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./layout.component').then((m) => m.LayoutComponent),
    children: [
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./Pages/dash-board/dash-board.component').then(
            (d) => d.DashBoardComponent,
          ),
      },
      {
        path: 'usuarios',
        loadComponent: () =>
          import('./Pages/usuario/usuario.component').then(
            (d) => d.UsuarioComponent,
          ),
      },
      {
        path: 'productos',
        loadComponent: () =>
          import('./Pages/producto/producto.component').then(
            (d) => d.ProductoComponent,
          ),
      },
      {
        path: 'vender',
        loadComponent: () =>
          import('./Pages/venta/venta.component').then((d) => d.VentaComponent),
      },
      {
        path: 'historial-ventas',
        loadComponent: () =>
          import('./Pages/historial-venta/historial-venta.component').then(
            (d) => d.HistorialVentaComponent,
          ),
      },
      {
        path: 'reportes',
        loadComponent: () =>
          import('./Pages/reporte/reporte.component').then(
            (d) => d.ReporteComponent,
          ),
      },
    ],
  },
];
export default routes;
