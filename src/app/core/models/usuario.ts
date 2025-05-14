import { Observable } from 'rxjs';
import { Login } from './login';

export interface Usuario {
  idUsuario: number;
  nombreApellidos: string;
  correo: string;
  idRol: number;
  rolDescripcion: string;
  clave: string;
  esActivo: number;
}
export interface IReadable<T> {
  obtenerPorId(id: number | string): Observable<T>;
  obtenerTodos(): void;
}
export interface IWriteable<T> {
  guardar(entidad: T): Observable<T>;
  actualizar(id: number | string, entidad: T): Observable<T>;
  eliminar(id: Usuario): Observable<void>;
}
export interface ICrudService<T> extends IReadable<T>, IWriteable<T> {}
export interface IUsuarioService<T> {
  iniciarSesion(request: Login): Observable<T>;
  listar(): Observable<T>;
  guardar(request: Usuario): Observable<T>;
  editar(request: Usuario): Observable<T>;
  eliminar(id: number): Observable<T>;
}
