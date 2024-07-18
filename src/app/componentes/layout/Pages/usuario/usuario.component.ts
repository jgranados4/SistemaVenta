import {
  Component,
  OnInit,
  AfterViewInit,
  ViewChild,
  viewChild,
  inject,
  signal,
  model,
  effect,
} from '@angular/core';
import { ModalUsuarioComponent } from '../../modales/modal-usuario/modal-usuario.component';

import { Usuario } from '@core/models/usuario';
import { UsuarioService } from '@core/services/usuario.service';
import { UtilidadService } from '@core/services/utilidad.service';
import Swal from 'sweetalert2';
import { filter } from 'rxjs';
import { TableRtzeComponent } from '@shared/components/table-rtze/table-rtze.component';
import { Table } from '@core/models/table/table';
import { NotificacionComponent } from '@shared/components/notificacion/notificacion.component';

@Component({
  selector: 'app-usuario',
  standalone: true,
  imports: [ModalUsuarioComponent, TableRtzeComponent, NotificacionComponent],
  templateUrl: './usuario.component.html',
  styleUrl: './usuario.component.css',
})
export class UsuarioComponent implements OnInit, AfterViewInit {
  columnasTablas: any[] = [
    'nombreCompleto',
    'correo',
    'idRol',
    'rolDescripcion',
    'esActivo',
  ];
  dataInicio: Usuario[] = [];
  dataListaUsuario = this.dataInicio;
  modalUsuario = signal<boolean>(false);
  agregar = signal<string>('Agregar');
  modalSwitch = signal<boolean>(false);
  //@viewChild
  //*inject
  private _usuarioService = inject(UsuarioService);
  private _utilidadService = inject(UtilidadService);
  //input
  constructor() {
    effect(() => {});
  }
  ngOnInit(): void {
    this.ObtenerUsuario();
  }
  ObtenerUsuario() {
    this._usuarioService.listar().subscribe({
      next: (data) => {
        if (data.status) this.dataListaUsuario = data.value;
        else this._utilidadService.mostrarAlert('No se encontro datos', 'OPPS');
      },
      error: (e) => {},
    });
  }
  ngAfterViewInit(): void {
    //Pagina de tablas
  }

  aplicarFiltroTabla(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataListaUsuario.filter(() => filterValue.trim().toLocaleLowerCase());
  }

  nuevoUsuario() {
    //modal
    this.openModal();
  }

  editarUsuario() {
    //modal
  }
  eliminarUsuario(usuario: Usuario) {
    Swal.fire({
      title: 'Desea eliminar el Usuario?',
      text: usuario.nombreCompleto,
      icon: 'warning',
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'si,eliminar',
      showCancelButton: true,
      cancelButtonColor: '#d33',
      cancelButtonText: 'No , volver',
    }).then((resultado) => {
      if (resultado.isConfirmed) {
        this._usuarioService.eliminar(usuario.idUsuario).subscribe({
          next: (data) => {
            if (data.status)
              this._utilidadService.mostrarAlert(
                'El usuario fue eliminado',
                'OPPS'
              );
          },
        });
      }
    });
  }
  //
  openModal() {
    this.modalSwitch.set(!this.modalSwitch());
  }
  closeModal() {
    this.modalSwitch.set(false);
  }
}
