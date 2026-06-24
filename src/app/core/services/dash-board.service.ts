
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { ResponseApi } from '@core/interface';
import { Observable } from 'rxjs';
import { inject, Service } from '@angular/core';
@Service()
export class DashBoardService {
  private readonly url = `${environment.endpoint}DashBoard`;
  private http = inject(HttpClient);


  resumen(): Observable<ResponseApi> {
    return this.http.get<ResponseApi>(`${this.url}/Listar`);
  }
}
