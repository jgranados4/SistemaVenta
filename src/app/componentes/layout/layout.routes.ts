import { Routes } from '@angular/router';
import { LayoutComponent } from './layout.component';
import { DashBoardComponent } from './Pages/dash-board/dash-board.component';
import { UsuarioComponent } from './Pages/usuario/usuario.component';
import { ProductoComponent } from './Pages/producto/producto.component';
import { VentaComponent } from './Pages/venta/venta.component';
import { HistorialVentaComponent } from './Pages/historial-venta/historial-venta.component';
import { ReporteComponent } from './Pages/reporte/reporte.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: 'dasboard',
        loadComponent: () =>
          import('./Pages/dash-board/dash-board.component').then(
            (d) => d.DashBoardComponent
          ),
      },
      {
        path: 'usuarios',
        loadComponent: () =>
          import('./Pages/usuario/usuario.component').then(
            (d) => d.UsuarioComponent
          ),
      },
      {
        path: 'productos',
        loadComponent: () =>
          import('./Pages/producto/producto.component').then(
            (d) => d.ProductoComponent
          ),
      },
      {
        path: 'Venta',
        loadComponent: () =>
          import('./Pages/venta/venta.component').then((d) => d.VentaComponent),
      },
      {
        path: 'historial_venta',
        loadComponent: () =>
          import('./Pages/historial-venta/historial-venta.component').then(
            (d) => d.HistorialVentaComponent
          ),
      },
      {
        path: 'reportes',
        loadComponent: () =>
          import('./Pages/reporte/reporte.component').then(
            (d) => d.ReporteComponent
          ),
      },
    ],
  },
];
export default routes;
