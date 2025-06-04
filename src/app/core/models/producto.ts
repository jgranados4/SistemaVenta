import { Observable } from 'rxjs';

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

export interface IProductoService<T> {
  listar(): Observable<T>;
  guardar(request: Producto): Observable<T>;
  editar(request: Producto): Observable<T>;
  eliminar(id: number): Observable<T>;
}
