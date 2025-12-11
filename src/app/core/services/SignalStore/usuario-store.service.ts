import { computed, inject, Injectable, signal } from '@angular/core';
import { Usuario,ICrudService,ResponseApi } from '@core/interface';
import { catchError, filter, finalize, from, map, Observable, switchMap, tap } from 'rxjs';
import { UsuarioService } from '../index';
import { extractErrorMessage } from '@core/Utils';
import { showAlert } from '@shared/utility';

interface WritingState {
  saving: boolean;
  deleting: boolean;
  error: string | null;
}

@Injectable({
  providedIn: 'root',
})
export class UsuarioStoreService implements ICrudService<Usuario> {
  //*SIGNAL
  readonly #writingState = signal<WritingState>({
    saving: false,
    deleting: false,
    error: null,
  });
  //*INJECT
  private readonly _usuarioService = inject(UsuarioService);
  //✅computed
  //✅ Señales para operaciones de escritura
  readonly saving = computed(() => this.#writingState().saving);
  readonly deleting = computed(() => this.#writingState().deleting);
  readonly values = computed<Usuario[]>(() => {
    const response = this._usuarioService.listar.value();
    return response?.status ? response.value : [];
  });
  readonly loading = computed(() => this._usuarioService.listar.isLoading());
  readonly error = computed(() => {
    const resourceError = this._usuarioService.listar.error();
     const writingError = this.#writingState().error;
    if (resourceError) {
      return resourceError instanceof Error
        ? resourceError.message
        : 'Error loading users';
    }
    return writingError;
  });
  // ============================================
  // 🔧 MÉTODOS AUXILIARES PRIVADOS
  // ============================================

  readonly #patchWritingState = (patch: Partial<WritingState>) => {
    this.#writingState.update((current) => ({ ...current, ...patch }));
  };
  obtenerTodos(): void {
    // El httpResource del servicio se carga automáticamente
    // No necesita hacer nada, solo acceder a values() activa la petición

    // Si necesitas forzar una recarga:
    this.reload();
  }
  reload(): void {
    this._usuarioService.listar.reload();
  }
  guardar(entidad: Usuario): Observable<Usuario> {
       this.#patchWritingState({ saving: true, error: null });
       return this._usuarioService.guardar(entidad).pipe(
         tap((data: ResponseApi) => {
           if (!data.status) {
             const errorMsg = data.msg || 'Error al guardar usuario';
             // ✨ MEJORA: Lanzar error para catchError
             throw new Error(errorMsg);
           }
         }),
         // ✨ MEJORA: finalize para limpiar estado siempre
         finalize(() => {
           this.#patchWritingState({ saving: false });
         }),
         tap(() => {
           // ✨ MEJORA: Solo recargar si guardó exitosamente
           this.reload();
         }),
         map((data) => data.value),
         // ✨ MEJORA: catchError centralizado
         catchError((err) => {
           const errorMsg = extractErrorMessage(err);
           this.#patchWritingState({ error: errorMsg });
           throw err; // Re-lanzar para que el componente pueda manejarlo
         })
       );
  }
  actualizar(entidad: Usuario): Observable<Usuario> {
     this.#patchWritingState({ saving: true, error: null });

     return this._usuarioService.editar(entidad).pipe(
       tap((response: ResponseApi) => {
         if (!response.status) {
           const errorMsg = response.msg || 'Error al actualizar usuario';
           throw new Error(errorMsg);
         }
       }),
       finalize(() => {
         this.#patchWritingState({ saving: false });
       }),
       tap(() => {
         this.reload();
       }),
       map((data) => data.value),
       catchError((err) => {
         const errorMsg = extractErrorMessage(err);
         this.#patchWritingState({ error: errorMsg });
         throw err;
       })
     );
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
      tap(() => {
        this.#patchWritingState({ deleting: true, error: null });
      }),
      switchMap(() => this._usuarioService.eliminar(usuario.idUsuario)),
      tap((response: ResponseApi) => {
        if (!response.status) {
          const errorMsg = response.msg || 'Error al eliminar usuario';
          throw new Error(errorMsg);
        }
      }),
      finalize(() => {
        this.#patchWritingState({ deleting: false });
      }),
      tap(() => {
        this.reload();
      }),
      map(() => void 0),
      catchError((err) => {
        const errorMsg = extractErrorMessage(err);
        this.#patchWritingState({ error: errorMsg });
        throw err;
      })
    );
  }
  clearError(): void {
    this.#patchWritingState({ error: null });
  }

  /**
   * Reset completo del store
   */
  reset(): void {
    this.#writingState.set({
      saving: false,
      deleting: false,
      error: null,
    });
  }
}
