import { computed, inject, Injectable, signal } from '@angular/core';
import { ICrudService,Producto,ResponseApi,showAlert } from '@core/interface';
import {
  catchError,
  filter,
  finalize,
  from,
  map,
  Observable,
  switchMap,
  tap,
} from 'rxjs';
import { ProductoService } from '../producto.service';
import { extractErrorMessage } from '@core/Utils';

interface WritingState {
  saving: boolean;
  deleting: boolean;
  error: string | null;
}

@Injectable({
  providedIn: 'root',
})
export class ProductoStoreService implements ICrudService<Producto> {
  // 🔐 Estado privado (writable signal)
  readonly #writingState = signal<WritingState>({
    saving: false,
    deleting: false,
    error: null,
  });
  //💉 INYECCIONES
  private readonly _productoService = inject(ProductoService);
  // 📊 COMPUTED SIGNALS (SOLO LECTURA)
  // ============================================
  // Estados de escritura
  readonly saving = computed(() => this.#writingState().saving);
  readonly deleting = computed(() => this.#writingState().deleting);

  // Estados de lectura desde httpResource
  readonly values = computed<Producto[]>(() => {
    const response = this._productoService.listar.value();
    return response?.status ? response.value : [];
  });

  readonly loading = computed(() => this._productoService.listar.isLoading());

  // ✨ MEJORA: Error unificado con mejor tipado
  readonly error = computed(() => {
    const resourceError = this._productoService.listar.error();
    const writingError = this.#writingState().error;

    if (resourceError) {
      return resourceError instanceof Error
        ? resourceError.message
        : 'Error al cargar usuarios';
    }
    return writingError;
  });
  // 🔧 MÉTODOS PRIVADOS
  // ============================================
  readonly #patchWritingState = (patch: Partial<WritingState>) => {
    this.#writingState.update((current) => ({ ...current, ...patch }));
  };
  reload(): void {
    this._productoService.listar.reload();
  }
  obtenerTodos(): void {
    this.reload();
  }
  guardar(entidad: Producto): Observable<Producto> {
    this.#patchWritingState({ saving: true, error: null });

    return this._productoService.guardar(entidad).pipe(
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
  actualizar(entidad: Producto): Observable<Producto> {
    this.#patchWritingState({ saving: true, error: null });

    return this._productoService.editar(entidad).pipe(
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
  eliminar(producto: Producto): Observable<void> {
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
      tap(() => {
        this.#patchWritingState({ deleting: true, error: null });
      }),
      switchMap(() => this._productoService.eliminar(producto.idProducto)),
      tap((response: ResponseApi) => {
        if (!response.status) {
          const errorMsg = response.msg || 'Error al eliminar producto';
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
  // 🧹 UTILIDADES
  // ============================================
  clearError(): void {
    this.#patchWritingState({ error: null });
  }

  reset(): void {
    this.#writingState.set({
      saving: false,
      deleting: false,
      error: null,
    });
  }
}
