import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { ProductoStoreService } from '@core/services/SignalStore/producto-store.service';
import { ApxTabla, TableAction } from '@jgranados199795/apx-ui/apx-tabla';
import { MaterialModule } from '@jgranados199795/apx-ui/apx-material';
import { ModalService } from '@core/services';
import { ModalProductoComponent } from '@component/layout/modales/modal-producto/modal-producto.component';
import { Producto, showAlert } from '@core/interface';

@Component({
  selector: 'app-producto',
  standalone: true,
  imports: [ApxTabla,MaterialModule],
  templateUrl: './producto.component.html',
  styleUrl: './producto.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'p-4',
  },
})
export class ProductoComponent {
  agregar = signal<string>('Agregar Producto');
  //
  columnasTablas: any[] = [
    { key: 'idProducto',label:'ID'},
    { key: 'nombre',label:'Nombre'},
    { key: 'descripcionCategoria',label:'Descripcion'},
    { key: 'stock',label:'Stock'},
    { key: 'precio',label:'Precio'},
    { key: 'esActivoTexto',label:'Estado'},
  ];

  editarPro = signal<string>('EditarProducto');
  productoFiltro = signal<string>('');
  producto = inject(ProductoStoreService);
  readonly #dialogModal = inject(ModalService);
  dataListaProducto = computed(() => {
    const value = this.producto.values();
    return value;
  });
  listaFiltrada = computed(() => {
    const filtro = this.productoFiltro().toLowerCase().trim();
    const lista = this.dataListaProducto().map((producto) => ({
      ...producto,
      esActivoTexto: producto.esActivo === 1 ? 'Activo' : 'Inactivo',
    }));
    if (!filtro) return lista;
    return lista.filter((u) =>
      u.nombre.toLowerCase().includes(filtro)
    );
  });
  constructor() {
  }

  aplicarFiltroTabla(event: Event) {
    console.log('entrar', event.target);
    const filterValue = (event.target as HTMLInputElement).value;
    this.productoFiltro.set(filterValue);
  }
 
  nuevoProducto() {
    this.#dialogModal.openModal<ModalProductoComponent>(ModalProductoComponent);
  }
  handleEdit(event: TableAction<Producto>): void {
    console.log('Editando usuario:', event.row);
    // Aquí podrías abrir un dialog de edición
    const dialogRef = this.#dialogModal.openModal<ModalProductoComponent, any>(
      ModalProductoComponent,
      {
        data: {
          producto: event.row,
        },
      }
    );
  }

  // Manejar eliminación
  handleDelete(event: TableAction<Producto>): void {
    console.log('Eliminando usuario:', event.row);
this.producto.eliminar(event.row).subscribe({
        next: () => {
          console.log('Producto eliminado correctamente');
          showAlert('¡Operación exitosa!', 'Eliminado correctamente.', 'success');
        },
      });
  }
}
