import { httpResource } from '@angular/common/http';
import { Service } from '@angular/core';
import { environment } from 'src/environments/environment.development';
import { ResponseApi } from '@core/interface';

@Service()
export class PlanesService {
  private readonly url = `${environment.endpoint}Plan`;

  readonly listar = httpResource<ResponseApi>(() => `${this.url}/Listar`);
}
