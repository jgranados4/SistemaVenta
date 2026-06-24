import { HttpClient, httpResource } from '@angular/common/http';
import { inject, Service } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { ResponseApi } from '@core/interface';
import { UtilidadService } from './utilidad.service';


@Service()
export class MenuService {
  private http = inject(HttpClient);
  readonly #utilidadService = inject(UtilidadService);
  readonly idusuario=this.#utilidadService.usuario()?.idUsuario
  private readonly url = `${environment.endpoint}Menu`;

  readonly listar = httpResource<ResponseApi>(() => {
    if(!this.idusuario) return undefined
    return `${this.url}/Listar/${this.idusuario}`
  });
}
