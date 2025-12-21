import { Observable } from 'rxjs';
import { Login } from './login';
import { HttpResourceRef } from '@angular/common/http';

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
  listar: HttpResourceRef<T | undefined >;
  guardar(request: Usuario): Observable<T>;
  editar(request: Usuario): Observable<T>;
  eliminar(id: number): Observable<T>;
}

export interface UsuarioData {
  esActivoTexto: string;
  idUsuario: number;
  nombreApellidos: string;
  correo: string;
  idRol: number;
  rolDescripcion: string;
  clave: string;
  esActivo: number;
}

export interface UsuarioRow {
  idUsuario: number;
  nombreApellidos: string;
  correo: string;
  rolDescripcion: string;
  esActivoTexto: string;
}
