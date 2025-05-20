import { Observable } from "rxjs";

export interface IReadable<T> {
  obtenerPorId(id: number | string): Observable<T>;
  obtenerTodos(): void;
}
export interface IWriteable<T> {
  guardar(entidad: T): Observable<T>;
  actualizar(entidad: T): Observable<T>;
  eliminar(id: T): Observable<void>;
}
export interface ICrudService<T> extends IReadable<T>, IWriteable<T> {}
