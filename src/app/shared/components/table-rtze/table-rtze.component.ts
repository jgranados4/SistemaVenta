import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  EventEmitter,
  inject,
  Input,
  input,
  model,
  OnInit,
  output,
  Output,
  OutputEmitterRef,
  signal,
  Signal,
  WritableSignal,
} from '@angular/core';
import { ModalProductoComponent } from '@component/layout/modales/modal-producto/modal-producto.component';
import { ModalUsuarioComponent } from '@component/layout/modales/modal-usuario/modal-usuario.component';
import { Producto } from '@core/models/producto';
import { Accion } from '@core/models/table/tabla-columna';
import { Usuario } from '@core/models/usuario';
import { showAlert } from '@core/models/utility.Alert';
import { UsuarioStoreService } from '@core/services/SignalStore/usuario-store.service';

@Component({
  selector: 'app-table-rtze',
  standalone: true,
  imports: [ModalUsuarioComponent, ModalProductoComponent],
  templateUrl: './table-rtze.component.html',
  styleUrl: './table-rtze.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'overflow-x-auto shadow-md sm:rounded-lg',
  },
})
export class TableRtzeComponent {
  columnas: any[] = [];
  editarT = signal<string>('Editar Producto');
  editar = signal<string>('Editar');
  //
  idData = signal<Usuario | undefined>(undefined);
  idDataPro = signal<Producto | undefined>(undefined);

  modalSwitch = signal<boolean>(false);
  showUserModalSwitch = signal<boolean>(false);
  showProductModalSwitch = signal<boolean>(false);

  UsuarioStor = inject(UsuarioStoreService);

  titulo = input<string>('');
  TipoEntidad = computed(() => {
    const valor = this.titulo();
    if (valor == 'EditarUsuario') return 'EditarUsuario';
    if (valor == 'EditarProducto') return 'EditarProducto';
    return 'otro';
  });
  //
  @Input() set columns(columns: any[]) {
    this.columnas = columns;
  }
  data2 = model<any[]>([]);
  data = computed(() => {
    return this.data2();
  });
  public efectos = effect(() => {
    console.log('efeto', this.TipoEntidad());
    console.log('efecto de data model', this.data());
    // Este efecto se ejecutará cuando idData cambie.
    if (this.idData()) {
      console.log('ID de Usuario actualizado:', this.idData());
    }
    if (this.idDataPro()) {
      console.log('ID de Producto actualizado:', this.idDataPro());
    }
  });
  onAction(accion: string, row?: any) {
    if (accion === 'Editar Usuario') {
      this.showUserModalSwitch.set(true);
      this.showProductModalSwitch.set(false);
      this.idData.set(row);
      this.openModal();
    }
    if (accion === 'Editar Producto') {
      this.idDataPro.set(row);
      this.showProductModalSwitch.set(true);
      this.showUserModalSwitch.set(false);
      this.openModal();
    }
  }
  eliminar(accion: string, row?: any) {
    this.UsuarioStor.eliminar(row).subscribe({
      next: () => {
        console.log('Usuario eliminado correctamente');
        showAlert(
          '¡Operación exitosa!',
          'La Eliminado se completó correctamente.',
          'success'
        );
      },
      error: (err) => {
        console.error('Error al eliminar el usuario:', err);
      },
    });
  }
  openModal() {
    this.modalSwitch.set(!this.modalSwitch());
  }
  closeModal() {
    this.modalSwitch.set(false);
  }
}
