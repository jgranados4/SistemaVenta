import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { ModalProductoComponent } from '@component/layout/modales/modal-producto/modal-producto.component';
import { Producto } from '@core/models/producto';
import { ProductoStoreService } from '@core/services/SignalStore/producto-store.service';
import { ApxTabla } from '@jgranados199795/apx-ui/apx-tabla';
import { MaterialModule } from '@jgranados199795/apx-ui/apx-material';

@Component({
  selector: 'app-producto',
  standalone: true,
  imports: [ModalProductoComponent,ApxTabla,MaterialModule],
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
    { key: 'nombre',label:'Nombre'},
    { key: 'descripcionCategoria',label:'Descripcion'},
    { key: 'stock',label:'Stock'},
    { key: 'precio',label:'Precio'},
    { key: 'esActivoTexto',label:'Estado'},
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
    const lista = this.dataListaProducto().map((producto) => ({
      ...producto,
      esActivoTexto: producto.esActivo === 1 ? 'Activo' : 'Desactivado',
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
