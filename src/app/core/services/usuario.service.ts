import { HttpClient, httpResource } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { Login ,ResponseApi,Usuario,IUsuarioService} from '@core/interface';
import { Observable } from 'rxjs';
import { UtilidadService } from './utilidad.service';

@Service()
export class UsuarioService implements IUsuarioService<ResponseApi> {
  private readonly url = `${environment.endpoint}Usuario`;
  private http = inject(HttpClient);
  //Opcional
  readonly #utilidadService = inject(UtilidadService);
  //
  readonly #idEmpresa = this.#utilidadService.idEmpresa();
  //Iniciar sesión
  iniciarSesion(request: Login): Observable<ResponseApi> {
    return this.http.post<ResponseApi>(
      `${this.url}/ValidarCredenciales`,
      request,
    );
  }
  readonly listar = httpResource<ResponseApi>(() => {
    if (!this.url) {
      return undefined;
    }
    if (!this.#idEmpresa) return undefined;
    return `${this.url}/Listar/${this.#idEmpresa}`;
  });
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
