import { detalleVentaDTOs } from './detalle-venta';

export interface Venta {
  idVenta?: number;
  numeroDocumento?: string;
  tipoPago: string;
  total: string;
  fechaRegistro?: string;
  detalleVentaDTOs?: detalleVentaDTOs[];
}
