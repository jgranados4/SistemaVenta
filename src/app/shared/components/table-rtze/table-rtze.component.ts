import {
  Component,
  EventEmitter,
  Input,
  input,
  Output,
  signal,
  Signal,
} from '@angular/core';
import { ModalUsuarioComponent } from '@component/layout/modales/modal-usuario/modal-usuario.component';
import { Accion } from '@core/models/table/tabla-columna';

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
  editar = signal<string>('Editar');

  @Input() set titulo(title: any) {
    this.title = title;
  }

  @Input() set columns(columns: any[]) {
    this.columnas = columns;
  }
  @Input() set data(data: any) {
    console.log('DATA', data);
    this.dataSource = data;
  }
  @Output() action: EventEmitter<Accion> = new EventEmitter();
  onAction(accion: string, row?: any) {
    this.action.emit({
      accion: accion,
      fila: row,
    });
  }
}
