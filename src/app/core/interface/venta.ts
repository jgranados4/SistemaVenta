import { detalleVentaDTOs } from './detalle-venta';

export interface Venta {
  tipoPago: string;
  total: string;
  detalleVentaDTOs?: detalleVentaDTOs[];
}


export type VentaType = Venta & {
  IdVenta: number;
  numeroDocumento: string;
  fechaRegistro: string;
};