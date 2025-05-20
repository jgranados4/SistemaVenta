import {
  Component,
  inject,
  signal,
  model,
  effect,
  ChangeDetectionStrategy,
  untracked,
  computed,
  Injector,
  OnDestroy,
} from '@angular/core';
import { ModalUsuarioComponent } from '../../modales/modal-usuario/modal-usuario.component';
import { toSignal } from '@angular/core/rxjs-interop';
import { Usuario } from '@core/models/usuario';
import { UsuarioService } from '@core/services/usuario.service';
import { UtilidadService } from '@core/services/utilidad.service';
import Swal from 'sweetalert2';
import { TableRtzeComponent } from '@shared/components/table-rtze/table-rtze.component';

import { UsuarioStoreService } from '@core/services/SignalStore/usuario-store.service';

@Component({
  selector: 'app-usuario',
  standalone: true,
  imports: [ModalUsuarioComponent, TableRtzeComponent],
  templateUrl: './usuario.component.html',
  styleUrl: './usuario.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'p-6',
  },
})
export class UsuarioComponent implements OnDestroy {
  columnasTablas: any[] = [
    'idUsuario',
    'nombreApellidos',
    'correo',
    'idRol',
    'rolDescripcion',
    'esActivo',
  ];
  UsuarioFiltro = signal<string>('');
  modalUsuario = signal<boolean>(false);
  agregar = signal<string>('Agregar');
  modalSwitch = signal<boolean>(false);
  usuarios = signal<string>('EditarUsuario');
  //*inject

  Usuario = inject(UsuarioStoreService);
  injector = inject(Injector);
  dataListaUsuario = computed(() => {
    const value = this.Usuario.values();
    return value;
  });
  listaFiltrada = computed(() => {
    const filtro = this.UsuarioFiltro().toLowerCase().trim();
    if (!filtro) return this.dataListaUsuario();

    return this.dataListaUsuario().filter((usuario: any) =>
      usuario.nombreApellidos.toLowerCase().includes(filtro)
    );
  });
  // dataListaUsuario2 = toSignal(
  //   this._usuarioService.listar().pipe(
  //     map((resp) => {
  //       if (resp.status) {
  //         return resp; // Devuelve tal cual si es correcto
  //       } else {
  //         this._utilidadService.mostrarAlert('No se encontró datos', 'OPPS');
  //         return { status: false, msg: resp.msg || '', value: [] }; // Estructura consistente
  //       }
  //     }),
  //     catchError((error) => {
  //       console.error('Error al obtener usuarios', error);
  //       this._utilidadService.mostrarAlert('Error de red', 'ERROR');
  //       return of({ status: false, msg: 'Error de red', value: [] });
  //     })
  //   ),
  //   {
  //     initialValue: { status: false, msg: '', value: [] },
  //   }
  // );
  constructor() {
    effect(
      () => {
        this.Usuario.obtenerTodos();
      },
      {
        allowSignalWrites: true,
      }
    );
  }

  // effectos = effect(
  //   () => {
  //     this.dataListaUsuario();
  //     console.log('Componente Usuarios', this.dataListaUsuario());
  //   },
  //   {
  //     injector: this.injector,
  //   }
  // );

  aplicarFiltroTabla(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.UsuarioFiltro.set(filterValue);
  }

  nuevoUsuario() {
    //modal
    this.openModal();
  }

  //
  openModal() {
    this.modalSwitch.set(true);
  }
  closeModal() {
    this.modalSwitch.set(false);
  }
  ngOnDestroy(): void {
    // this.effectos.destroy();
  }
}
