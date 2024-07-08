import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { ResponseApi } from '../models/response-api';
import { Login } from '../models/login';
import { Usuario } from '../models/usuario';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UsuarioService {
  private readonly url = `${environment.endpoint}Usuario`;
  private http = inject(HttpClient);

  constructor() {}

  //Iniciar sesión
  iniciarSesion(request: Login): Observable<ResponseApi> {
    return this.http.post<ResponseApi>(`${this.url}/IniciarSesion`, request);
  }
  listar(): Observable<ResponseApi> {
    return this.http.get<ResponseApi>(`${this.url}/Listar`);
  }
  guardar(request: Usuario): Observable<ResponseApi> {
    return this.http.post<ResponseApi>(`${this.url}/Crear`, request);
  }
  editar(request: Usuario): Observable<ResponseApi> {
    return this.http.put<ResponseApi>(`${this.url}/Editar`, request);
  }
  eliminar(id: number): Observable<ResponseApi> {
    return this.http.delete<ResponseApi>(`${this.url}/Eliminar/${id}`);
  }
}
