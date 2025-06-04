import { computed, inject, Injectable, signal } from '@angular/core';
import { ICrudService } from '@core/models/Crud';
import { Producto } from '@core/models/producto';
import { filter, from, map, Observable, switchMap, tap } from 'rxjs';
import { ProductoService } from '../producto.service';
import { ResponseApi } from '@core/models/response-api';
import { showAlert } from '@core/models/utility.Alert';
interface productoState {
  res: Producto[];
  loading: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class ProductoStoreService implements ICrudService<Producto> {
  //*SIGNAL
  #state = signal<productoState>({
    res: [],
    loading: false,
  });
  private _productoService = inject(ProductoService);
  readonly values = computed(() => this.#state().res);
  readonly loading = computed(() => this.#state().loading);

  obtenerPorId(id: number | string): Observable<Producto> {
    throw new Error('Method not implemented.');
  }
  obtenerTodos(): void {
    this._productoService.listar().subscribe({
      next: (response: ResponseApi) => {
        console.log('response', response);
        if (response.status) {
          this.#state.set({
            res: response.value,
            loading: false,
          });
        }
      },
    });
  }
  guardar(entidad: Producto): Observable<Producto> {
    return this._productoService.guardar(entidad).pipe(
      tap((data: ResponseApi) => {
        if (data.status) {
          this.#state.update((state) => ({
            res: [...state.res, data.value],
            loading: false,
          }));
        }
      }),
      map((data) => data.value)
    );
  }
  actualizar(entidad: Producto): Observable<Producto> {
    return this._productoService.editar(entidad).pipe(
      tap(() => {
        this.#state.update((state) => ({
          res: state.res.map((u) =>
            u.idProducto === entidad.idProducto ? { ...entidad } : u
          ),
          loading: false,
        }));
      }),
      map((data) => data.value)
    );
  }
  eliminar(producto: Producto): Observable<void> {
    console.log('productos', producto);
    return from(
      showAlert('Desea eliminar el Producto?', producto.nombre, 'warning', {
        showCancelButton: true,
        confirmButtonText: 'Sí',
        cancelButtonText: 'No',
      })
    ).pipe(
      // Filtramos solo cuando el usuario confirme la eliminación.
      filter((resultado) => {
        return resultado.isConfirmed;
      }),
      // Encadenamos la llamada al servicio de eliminación.
      switchMap(() => this._productoService.eliminar(producto.idProducto)),
      // Cambiar el estado .
      tap((data) => {
        if (data.status) {
          this.#state.update((state) => ({
            ...state,
            res: state.res.filter((u) => u.idProducto !== producto.idProducto),
          }));
        }
      }),
      // Convertimos el tipo de dato a void para cumplir con el tipo Observable<void>.
      map(() => void 0)
    );
  }
}
