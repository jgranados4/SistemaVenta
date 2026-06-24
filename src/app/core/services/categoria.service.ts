import {  httpResource } from '@angular/common/http';
import { environment } from '../../../environments/environment.development';
import { ResponseApi } from '@core/interface';
import { Service } from '@angular/core';
@Service()
export class CategoriaService {
  private readonly url = `${environment.endpoint}Categoria`;

  readonly listar = httpResource<ResponseApi>(() => `${this.url}/Listar`);
}
