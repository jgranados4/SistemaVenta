import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  OnInit,
  signal,
} from '@angular/core';
import { ModalProductoComponent } from '@component/layout/modales/modal-producto/modal-producto.component';
import { Producto } from '@core/models/producto';
import { ProductoStoreService } from '@core/services/SignalStore/producto-store.service';
import { TableRtzeComponent } from '@shared/components/table-rtze/table-rtze.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-producto',
  standalone: true,
  imports: [ModalProductoComponent, TableRtzeComponent],
  templateUrl: './producto.component.html',
  styleUrl: './producto.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'p-4',
  },
})
export class ProductoComponent {
  //*variables
  modalSwitch = signal<boolean>(false);
  agregar = signal<string>('Agregar Producto');
  //
  columnasTablas: any[] = [
    'nombre',
    'idCategoria',
    'descripcionCategoria',
    'stock',
    'precio',
    'esActivo',
  ];

  editarPro = signal<string>('EditarProducto');
  productoFiltro = signal<string>('');
  producto = inject(ProductoStoreService);
  dataListaProducto = computed(() => {
    const value = this.producto.values();
    return value;
  });
  listaFiltrada = computed(() => {
    const filtro = this.productoFiltro().toLowerCase().trim();
    if (!filtro) return this.dataListaProducto();

    return this.dataListaProducto().filter((producto: Producto) =>
      producto.nombre.toLowerCase().includes(filtro)
    );
  });
  constructor() {
    effect(
      () => {
        this.producto.obtenerTodos();
      },
      {
        allowSignalWrites: true,
      }
    );
  }

  aplicarFiltroTabla(event: Event) {
    console.log('entrar', event.target);
    const filterValue = (event.target as HTMLInputElement).value;
    this.productoFiltro.set(filterValue);
  }
  openModal() {
    this.modalSwitch.set(!this.modalSwitch());
  }
  closeModal() {
    this.modalSwitch.set(false);
  }
  nuevoProducto() {
    //modal
    this.openModal();
  }
}
