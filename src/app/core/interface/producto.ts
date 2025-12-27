import { HttpResourceRef } from '@angular/common/http';
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

type Precio = string | number;

export interface IProductoService<T> {
 listar: HttpResourceRef<T | undefined >;
  guardar(request: Producto): Observable<T>;
  editar(request: Producto): Observable<T>;
  eliminar(id: number): Observable<T>;
}


