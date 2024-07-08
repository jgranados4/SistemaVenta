import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { ResponseApi } from '../models/response-api';
import { Observable } from 'rxjs';
import { Producto } from '../models/producto';

@Injectable({
  providedIn: 'root',
})
export class ProductoService {
  private http = inject(HttpClient);
  private readonly url = `${environment.endpoint}Producto`;
  constructor() {}
  listar(): Observable<ResponseApi> {
    return this.http.get<ResponseApi>(`${this.url}/Listar`);
  }
  guardar(request: Producto): Observable<ResponseApi> {
    return this.http.post<ResponseApi>(`${this.url}/Crear`, request);
  }
  editar(request: Producto): Observable<ResponseApi> {
    return this.http.put<ResponseApi>(`${this.url}/Editar`, request);
  }
  eliminar(id: number): Observable<ResponseApi> {
    return this.http.delete<ResponseApi>(`${this.url}/Eliminar/${id}`);
  }
}
