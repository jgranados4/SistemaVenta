import {
  Component,
  inject,
  signal,
  ChangeDetectionStrategy,
  computed,
  Injector,
  OnDestroy,
} from '@angular/core';
import { ModalUsuarioComponent } from '../../modales/modal-usuario/modal-usuario.component';
import { UsuarioStoreService } from '@core/services/SignalStore/usuario-store.service';
import { ApxTabla, TableAction } from '@jgranados199795/apx-ui/apx-tabla';
import { MaterialModule } from '@jgranados199795/apx-ui/apx-material';
import { ModalService } from '@core/services/modalServices/modal.service';
import {FormsModule} from '@angular/forms';
import { showAlert, Usuario} from '@core/models';

@Component({
  selector: 'app-usuario',
  imports: [ApxTabla, MaterialModule,FormsModule],
  templateUrl: './usuario.component.html',
  styleUrl: './usuario.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'p-6',
  },
})
export class UsuarioComponent implements OnDestroy {
  columnasTablas: any[] = [
    { key: 'idUsuario', label: 'ID' },
    { key: 'nombreApellidos', label: 'Nombre' },
    { key: 'correo', label: 'Correo' },
    { key: 'rolDescripcion', label: 'Rol' },
    { key: 'esActivoTexto', label: 'Estado' },
  ];
  UsuarioFiltro = signal<string>('');
  agregar = signal<string>('Agregar');
  //*inject

  Usuario = inject(UsuarioStoreService);
  injector = inject(Injector);
  readonly dialogModal = inject(ModalService);

  dataListaUsuario = computed(() => {
    const value = this.Usuario.values();
    return value;
  });
  listaFiltrada = computed(() => {
    const filtro = this.UsuarioFiltro().toLowerCase().trim();

    const lista = this.dataListaUsuario().map((usuario) => ({
      ...usuario,
      esActivoTexto: usuario.esActivo === 1 ? 'Activo' : 'Desactivado',
    }));
    if (!filtro) return lista;
    return lista.filter((u) =>
      u.nombreApellidos.toLowerCase().includes(filtro)
    );
  });

  constructor() {}
  aplicarFiltroTabla(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.UsuarioFiltro.set(filterValue);
  }
  nuevoUsuario(): void {
    this.dialogModal.openModal<ModalUsuarioComponent>(ModalUsuarioComponent);
  }
  handleEdit(event: TableAction<Usuario>): void {
    console.log('Editando usuario:', event.row);
    // Aquí podrías abrir un dialog de edición
    const dialogRef = this.dialogModal.openModal<ModalUsuarioComponent, any>(
      ModalUsuarioComponent,
      {
        data: {
          usuario: event.row,
        },
      }
    );
    // dialogRef.afterClosed().subscribe(result => {
    //   if (result) {
    //     this.users.update(users =>
    //       users.map(u => u.id === event.row.id ? result : u)
    //     );
    //   }
    // });
  }

  // Manejar eliminación
  handleDelete(event: TableAction<Usuario>): void {
    console.log('Eliminando usuario:', event.row);
this.Usuario.eliminar(event.row).subscribe({
        next: () => {
          console.log('Usuario eliminado correctamente');
          showAlert('¡Operación exitosa!', 'Eliminado correctamente.', 'success');
        },
        error: (err) => {
          console.error('Error al eliminar usuario:', err);
        },
      });
  }
  ngOnDestroy(): void {
    // this.effectos.destroy();
  }
}
