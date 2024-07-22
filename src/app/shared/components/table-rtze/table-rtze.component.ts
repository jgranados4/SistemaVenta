import {
  Component,
  EventEmitter,
  Input,
  input,
  Output,
  signal,
  Signal,
  WritableSignal,
} from '@angular/core';
import { ModalUsuarioComponent } from '@component/layout/modales/modal-usuario/modal-usuario.component';
import { Accion } from '@core/models/table/tabla-columna';
import { Usuario } from '@core/models/usuario';

@Component({
  selector: 'app-table-rtze',
  standalone: true,
  imports: [ModalUsuarioComponent],
  templateUrl: './table-rtze.component.html',
  styleUrl: './table-rtze.component.css',
})
export class TableRtzeComponent {
  // titulo = input<string>('');
  title = '';
  columnas: any[] = [];
  dataSource: any = [];
  //
  //
  idData = signal<Usuario | undefined>(undefined);
  editar = signal<string>('Editar');
  modalSwitch = signal<boolean>(false);

  @Input() set titulo(title: any) {
    this.title = title;
  }

  @Input() set columns(columns: any[]) {
    this.columnas = columns;
  }
  @Input() set data(data: any) {
    this.dataSource = data;
  }
  @Output() action: EventEmitter<Accion> = new EventEmitter();
  onAction(accion: string, row?: any) {
    if (accion == 'Editar') {
      this.idData.set(row);
      this.openModal();
    }
    this.action.emit({
      accion: accion,
      fila: row,
    });
  }
  openModal() {
    this.modalSwitch.set(!this.modalSwitch());
  }
  closeModal() {
    this.modalSwitch.set(false);
  }
}
