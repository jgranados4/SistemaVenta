import { HttpClient, httpResource } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { ResponseApi, IProductoService, Producto } from '@core/interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ProductoService implements IProductoService<ResponseApi> {
  private http = inject(HttpClient);
  private readonly url = `${environment.endpoint}Producto`;
  readonly listar= httpResource<ResponseApi>(()=>`${this.url}/Listar`);
 
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
