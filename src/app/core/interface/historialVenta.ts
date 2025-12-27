import { FormControl } from "@angular/forms";

export interface historialForm {
  buscarPor: FormControl<string>;
  numero: FormControl<string>;
  fechaInicio: FormControl<string>;
  fechaFin: FormControl<string>;
}

export interface opcionesBusqueda {
  value: string;
  descripcion:string;
}
export interface historialColumna {
  fechaRegistro:string;
  numeroDocumento:string;
  tipoPago:string;
  total:string;
}

export interface FiltrosHistorial {
  buscarPor:string ;
  numeroVenta: string;
  fechaInicio:string ;
  fechaFin: string;
}
export interface HistorialVentaItem {
  fechaRegistro: string;
  numeroDocumento: string;
  tipoPago: string;
  total: number;
}
export interface ventaHistorialResponse extends ventaResponse {
  numeroDocumento: string;
  fechaRegistro: string;
}

export interface ventaResponse {
  tipoPago: string;
  total: total;
  detalleVentaResponseDTOs?: detalleVentaResponseDTOs[];
}

type total = string | number;

export interface detalleVentaResponseDTOs {
  idProducto: number;
  descripcionProducto: string;
  cantidad: number;
  precio: string;
  total: string;
}