import { Observable } from "rxjs";

export interface IReadable<T> {
  obtenerTodos(): void;
}
export interface IWriteable<T> {
  guardar(entidad: T): Observable<T>;
  actualizar(entidad: T): Observable<T>;
  eliminar(id: T): Observable<void>;
}
export interface ICrudService<T> extends IReadable<T>, IWriteable<T> {}
