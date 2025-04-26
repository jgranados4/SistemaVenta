export interface Producto {
  idProducto: number;
  nombre: string;
  idCategoria: number;
  descripcionCategoria: string;
  stock: number;
  precio: Precio;
  esActivo: number;
}

type Precio = string | undefined;
