import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { ResponseApi } from '../models/response-api';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DashBoardService {
  private readonly url = `${environment.endpoint}DashBoard`;
  private http = inject(HttpClient);

  constructor() {}

  resumen(): Observable<ResponseApi> {
    return this.http.get<ResponseApi>(`${this.url}/Listar`);
  }
}
