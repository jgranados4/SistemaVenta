import { detalleVentaDTOs } from './detalle-venta';

export interface Venta {
  tipoPago: string;
  total: string;
  detalleVentaDTOs?: detalleVentaDTOs[];
}
