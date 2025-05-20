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

export interface IUsuarioService<T> {
  iniciarSesion(request: Login): Observable<T>;
  listar(): Observable<T>;
  guardar(request: Usuario): Observable<T>;
  editar(request: Usuario): Observable<T>;
  eliminar(id: number): Observable<T>;
}
