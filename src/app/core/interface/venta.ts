import { FormControl } from '@angular/forms';
import { detalleVentaDTOs } from './detalle-venta';
import { Producto } from './producto';

export interface VentaRequest {
  tipoPago: string;
  total: string;
  detalleVentaDTOs?: detalleVentaDTOs[];
}


export interface VentaRes extends VentaRequest {
  IdVenta: number;
  numeroDocumento: string;
  fechaRegistro: string;
};

export interface VentaForm {
  productoBusqueda: FormControl<string | Producto>;
  cantidad: FormControl<number>;
  tipoPago: FormControl<string>;
}


