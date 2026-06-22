import {
  Component,
  inject,
  signal,
  computed,

} from '@angular/core';
import { ModalUsuarioComponent } from '../../modales/modal-usuario/modal-usuario.component';
import { UsuarioStoreService } from '@core/services/SignalStore/usuario-store.service';
import { ApxTabla, TableAction, TableColumn } from '@jgranados199795/apx-ui/apx-tabla';
import { MaterialModule } from '@jgranados199795/apx-ui/apx-material';
import { ModalService } from '@core/services/modalServices/modal.service';
import {FormsModule} from '@angular/forms';
import {  Usuario, UsuarioRow} from '@core/interface';
import { showAlert } from '@shared/utility';

@Component({
  selector: 'app-usuario',
  imports: [ApxTabla, MaterialModule, FormsModule],
  templateUrl: './usuario.component.html',
  styleUrl: './usuario.component.css',

  host: {
    class: 'block p-6',
  },
})
export class UsuarioComponent {
  columnasTablas: TableColumn<UsuarioRow>[] = [
    { key: 'idUsuario', label: 'ID' },
    { key: 'nombreApellidos', label: 'Nombre' },
    { key: 'correo', label: 'Correo' },
    { key: 'rolDescripcion', label: 'Rol' },
    { key: 'esActivoTexto', label: 'Estado' },
  ];
  usuarioFiltro = signal<string>('');
  agregar = signal<string>('Agregar');
  //*inject

  Usuario = inject(UsuarioStoreService);
  readonly #dialogModal = inject(ModalService);

  private readonly dataListaUsuario = computed(() => this.Usuario.values());
  readonly listaFiltrada = computed(() => {
    const filtro = this.usuarioFiltro().toLowerCase().trim();

    const lista = this.dataListaUsuario().map((usuario) => ({
      ...usuario,
      esActivoTexto: usuario.esActivo === 1 ? 'Activo' : 'Inactivo',
    }));
    if (!filtro) return lista;
    return lista.filter((u) =>
      u.nombreApellidos.toLowerCase().includes(filtro)
    );
  });

  aplicarFiltroTabla(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.usuarioFiltro.set(filterValue);
  }
  limpiarFiltro(inputElement: HTMLInputElement): void {
    inputElement.value = '';
    this.usuarioFiltro.set('');
    inputElement.focus(); // Mejora de accesibilidad
  }
  nuevoUsuario(): void {
    this.#dialogModal.openModal<ModalUsuarioComponent>(ModalUsuarioComponent);
  }
  handleEdit(event: TableAction<Usuario>): void {
    console.log('Editando usuario:', event.row);
    // Aquí podrías abrir un dialog de edición
    this.#dialogModal.openModal<ModalUsuarioComponent, unknown>(
      ModalUsuarioComponent,
      {
        data: {
          usuario: event.row,
        },
      }
    );
  }
  // Manejar eliminación
  handleDelete(event: TableAction<Usuario>): void {
    console.log('Eliminando usuario:', event.row);
    this.Usuario.eliminar(event.row).subscribe({
      next: () => {
        console.log('Usuario eliminado correctamente');
        showAlert('¡Operación exitosa!', 'Eliminado correctamente.', 'success');
      },
    });
  }
}
