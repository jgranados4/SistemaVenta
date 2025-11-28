import {  httpResource } from '@angular/common/http';
import {  Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { ResponseApi } from '@core/interface';

@Injectable({
  providedIn: 'root',
})
export class RolService {
  private readonly url = `${environment.endpoint}Rol`;
  readonly listar = httpResource<ResponseApi>(() => `${this.url}/Listar`);
}
