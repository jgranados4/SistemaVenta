import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { Venta } from '../models/venta';
import { Observable } from 'rxjs';
import { ResponseApi } from '../models/response-api';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class VentaService {
  private readonly url = `${environment.endpoint}Venta`;
  private http = inject(HttpClient);

  constructor() {}
  registrar(request: Venta): Observable<ResponseApi> {
    return this.http.post<ResponseApi>(`${this.url}/Registrar`, request);
  }
  historial(
    buscarPor: string,
    numeroVenta: string,
    fechainicio: string,
    fechafin: string
  ): Observable<ResponseApi> {
    return this.http.get<ResponseApi>(
      `${this.url}/Historial?buscarPor=${buscarPor}&numeroVenta=${numeroVenta}&fechaInicio=${fechainicio}&fechaFin=${fechafin}`
    );
  }
  reporte(fechainicio: string, fechafin: string): Observable<ResponseApi> {
    return this.http.get<ResponseApi>(
      `${this.url}/Reporte?fechaInicio=${fechainicio}&fechaFin=${fechafin}`
    );
  }
}
