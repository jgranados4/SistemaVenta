import { inject, Injectable, Signal } from '@angular/core';
import { environment } from '../../../environments/environment.development';
import { ResponseApi, VentaRequest} from '@core/interface';
import { Observable } from 'rxjs';
import { HttpClient, httpResource, HttpResourceRef } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class VentaService {
  private readonly url = `${environment.endpoint}Venta`;
  private http = inject(HttpClient);
  registrar(request: VentaRequest): Observable<ResponseApi> {
    return this.http.post<ResponseApi>(`${this.url}/Registrar`, request);
  }
  //http Observable
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
  //httpResource
  historialR = (
    filtros: Signal<{
      buscarPor: string;
      numeroVenta: string;
      fechaInicio: string;
      fechaFin: string;
    }>
  ): HttpResourceRef<ResponseApi | undefined> => {
    return httpResource<ResponseApi>(() => {
      const f = filtros();
      const esBusquedaValida =
        (f.fechaInicio && f.fechaFin) || // Rango de fechas
        (f.numeroVenta && f.numeroVenta.length > 0); // O número de venta

      if (!esBusquedaValida) {
        return undefined; // <--- ESTO ES LA CLAVE: El resource no hará fetch.
      }
      // 🧹 LIMPIEZA DE PARÁMETROS
      // Creamos un objeto solo con los valores que existen para no enviar "campo="
      const params: Record<string, string> = {};
      if (f.buscarPor) params['buscarPor'] = f.buscarPor;
      if (f.numeroVenta) params['numeroVenta'] = f.numeroVenta;
      if (f.fechaInicio) params['fechaInicio'] = f.fechaInicio;
      if (f.fechaFin) params['fechaFin'] = f.fechaFin;
      return {
        url: `${this.url}/Historial`,
        params: params, // Enviamos params limpios
      };
    });
  };
}
