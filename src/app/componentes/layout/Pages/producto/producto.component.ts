import {
  ChangeDetectionStrategy,
  Component,
  computed,
  inject,
  signal,
} from '@angular/core';
import { ProductoStoreService } from '@core/services/SignalStore/producto-store.service';
import { ApxTabla, TableAction, TableColumn } from '@jgranados199795/apx-ui/apx-tabla';
import { MaterialModule } from '@jgranados199795/apx-ui/apx-material';
import { ModalService } from '@core/services';
import { ModalProductoComponent } from '@component/layout/modales/modal-producto/modal-producto.component';
import { Producto, ProductoRow } from '@core/interface';
import { showAlert } from '@shared/utility';
import { CurrencyPipe } from '@angular/common';
import { limpiarPrecio } from '@shared/utility/parsePrecioApi';

@Component({
  selector: 'app-producto',
  standalone: true,
  imports: [ApxTabla, MaterialModule],
  providers: [CurrencyPipe],
  templateUrl: './producto.component.html',
  styleUrl: './producto.component.css',
  
  host: {
    class: 'block p-6',
  },
})
export class ProductoComponent {
  columnasTablas: TableColumn<ProductoRow>[] = [
    { key: 'idProducto', label: 'ID' },
    { key: 'nombre', label: 'Nombre' },
    { key: 'descripcionCategoria', label: 'Descripcion' },
    { key: 'stock', label: 'Stock' },
    { key: 'precio', label: 'Precio' },
    { key: 'esActivoTexto', label: 'Estado' },
  ];

  editarPro = signal<string>('EditarProducto');
  productoFiltro = signal<string>('');
  productoStore = inject(ProductoStoreService);
  readonly #dialogModal = inject(ModalService);
  private readonly _currencyPipe = inject(CurrencyPipe);
  dataListaProducto = computed(() => {
    const value = this.productoStore.values();
    return value;
  });
  // constructor(){
  //   effect(()=>{
  //   })
  // }
  readonly listaFiltrada = computed(() => {
    const filtro = this.productoFiltro().toLowerCase().trim();
    // Mapeamos los datos asegurando la conversion
    const lista = this.dataListaProducto().map((producto) => {
      const precioNumerico = limpiarPrecio(producto.precio);
      return {
        ...producto,
        precio:
          this._currencyPipe.transform(
            precioNumerico,
            'USD',
            'symbol',
            '1.2-2',
            'es-EC'
          ) || '$ 0,00',

        esActivoTexto: producto.esActivo === 1 ? 'Activo' : 'Inactivo',
      } as unknown as Producto;
    });

    if (!filtro) return lista;
    return lista.filter((u) => u.nombre.toLowerCase().includes(filtro));
  });

  aplicarFiltroTabla(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.productoFiltro.set(filterValue);
  }
  limpiarFiltro(inputElement: HTMLInputElement): void {
    inputElement.value = '';
    this.productoFiltro.set('');
    inputElement.focus();
  }

  nuevoProducto() {
    this.#dialogModal.openModal<ModalProductoComponent>(ModalProductoComponent);
  }
  handleEdit(event: TableAction<Producto>): void {
    console.log('Editando usuario:', event.row);
    // Aquí podrías abrir un dialog de edición
    this.#dialogModal.openModal<ModalProductoComponent, unknown>(
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
    this.productoStore.eliminar(event.row).subscribe({
      next: () => {
        console.log('Producto eliminado correctamente');
        showAlert('¡Operación exitosa!', 'Eliminado correctamente.', 'success');
      },
    });
  }
}
