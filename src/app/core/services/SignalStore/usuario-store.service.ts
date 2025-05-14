import { computed, inject, Injectable, signal } from '@angular/core';
import { ICrudService, Usuario } from '@core/models/usuario';
import { filter, from, map, Observable, switchMap, tap } from 'rxjs';
import { UsuarioService } from '../usuario.service';
import { ResponseApi } from '@core/models/response-api';
import Swal from 'sweetalert2';
import { UtilidadService } from '../utilidad.service';
import { showAlert } from '@core/models/utility.Alert';
interface usuarioState {
  res: Usuario[];
  loading: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class UsuarioStoreService implements ICrudService<Usuario> {
  //*SIGNAL
  #state = signal<usuarioState>({
    res: [],
    loading: false,
  });
  //*INJECT
  private _usuarioService = inject(UsuarioService);
  //*COMPUTED
  readonly values = computed(() => this.#state().res);
  readonly loading = computed(() => this.#state().loading);
  obtenerPorId(id: number | string): Observable<Usuario> {
    throw new Error('Method not implemented.');
  }
  obtenerTodos(): void {
    this._usuarioService.listar().subscribe({
      next: (response: ResponseApi) => {
        if (response.status) {
          this.#state.set({
            res: response.value,
            loading: false,
          });
        }
        console.log('stateusuarui', this.#state());
      },
    });
  }
  guardar(entidad: Usuario): Observable<Usuario> {
    return this._usuarioService.guardar(entidad).pipe(
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
  actualizar(id: number | string, entidad: Usuario): Observable<Usuario> {
    throw new Error('Method not implemented.');
  }
  eliminar(usuario: Usuario): Observable<void> {
    console.log('usuerios eliminar', usuario);
    return from(
      showAlert(
        'Desea eliminar el Usuario?',
        usuario.nombreApellidos,
        'warning',
        {
          showCancelButton: true,
          confirmButtonText: 'Sí',
          cancelButtonText: 'No',
        }
      )
    ).pipe(
      // Filtramos solo cuando el usuario confirme la eliminación.
      filter((resultado) => {
        return resultado.isConfirmed;
      }),
      // Encadenamos la llamada al servicio de eliminación.
      switchMap(() => this._usuarioService.eliminar(usuario.idUsuario)),
      // Cambiar el estado .
      tap((data) => {
        if (data.status) {
          this.#state.update((state) => ({
            ...state,
            res: state.res.filter((u) => u.idUsuario !== usuario.idUsuario),
          }));
        }
      }),
      // Convertimos el tipo de dato a void para cumplir con el tipo Observable<void>.
      map(() => void 0)
    );
  }
}
