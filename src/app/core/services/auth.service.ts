import { inject, Service } from '@angular/core';
import { ResponseApi } from '@core/interface';
import { Empresa } from '@core/interface/registroEmpresa';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { environment } from 'src/environments/environment.development';

@Service()
export class AuthService {
  private readonly url = `${environment.endpoint}Auth`;
  private http = inject(HttpClient);

  registrarNegocio(request:Partial<Empresa>):Observable<ResponseApi>{
    return this.http.post<ResponseApi>(`${this.url}/RegistrarNegocio`,request);
  };
}
