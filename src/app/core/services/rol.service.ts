import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { ResponseApi } from '../models/response-api';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class RolService {
  private http = inject(HttpClient);
  private readonly url = `${environment.endpoint}Rol`;
  constructor() {}
  lista(): Observable<ResponseApi> {
    return this.http.get<ResponseApi>(`${this.url}/Lista`);
  }
}
