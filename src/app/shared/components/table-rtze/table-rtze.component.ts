import {
  Component,
  EventEmitter,
  Input,
  input,
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

@Component({
  selector: 'app-table-rtze',
  standalone: true,
  imports: [ModalUsuarioComponent, ModalProductoComponent],
  templateUrl: './table-rtze.component.html',
  styleUrl: './table-rtze.component.css',
  host: {
    class: 'overflow-x-auto shadow-md sm:rounded-lg',
  },
})
export class TableRtzeComponent implements OnInit {
  // titulo = input<string>('');
  title = '';
  columnas: any[] = [];
  dataSource: any = [];
  showUserModal: boolean = false;
  showProductModal: boolean = false;
  editarT = signal<string>('Editar Producto');
  //
  idData = signal<Usuario | undefined>(undefined);
  idDataPro = signal<Producto | undefined>(undefined);
  editar = signal<string>('Editar');
  modalSwitch = signal<boolean>(false);

  ngOnInit(): void {}
  titulo = input<string>('');
  onEliminarProduct = output<Producto>();

  @Input() set columns(columns: any[]) {
    this.columnas = columns;
  }
  @Input() set data(data: any) {
    this.dataSource = data;
  }

  // action = output<Accion>();
  // @Output() action: EventEmitter<Accion> = new EventEmitter();
  onAction(accion: string, row?: any) {
    if (accion === 'Editar Usuario') {
      this.showUserModal = true;
      this.showProductModal = false;
      this.idData.set(row);
      this.openModal();
    }
    if (accion === 'Editar Producto') {
      this.idDataPro.set(row);
      this.openModal();
      this.showProductModal = true;
      this.showUserModal = false;
    }
  }
  eliminar(producto: Producto) {
    console.log('Eliminar');
    this.onEliminarProduct.emit(producto);
  }
  openModal() {
    this.modalSwitch.set(!this.modalSwitch());
  }
  closeModal() {
    this.modalSwitch.set(false);
  }
}
