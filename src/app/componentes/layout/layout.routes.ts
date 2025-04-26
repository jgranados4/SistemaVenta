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
      { path: 'dasboard', component: DashBoardComponent },
      {
        path: 'usuarios',
        component: UsuarioComponent,
      },
      {
        path: 'productos',
        component: ProductoComponent,
      },
      {
        path: 'Venta',
        component: VentaComponent,
      },
      {
        path: 'historial_venta',
        component: HistorialVentaComponent,
      },
      {
        path: 'reportes',
        component: ReporteComponent,
      },
    ],
  },
];
export default routes;
