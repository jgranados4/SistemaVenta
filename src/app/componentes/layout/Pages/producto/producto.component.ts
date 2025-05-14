import { Component, inject, OnInit, signal } from '@angular/core';
import { ModalProductoComponent } from '@component/layout/modales/modal-producto/modal-producto.component';
import { Producto } from '@core/models/producto';
import { ProductoService } from '@core/services/producto.service';
import { UtilidadService } from '@core/services/utilidad.service';
import { TableRtzeComponent } from '@shared/components/table-rtze/table-rtze.component';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-producto',
  standalone: true,
  imports: [ModalProductoComponent, TableRtzeComponent],
  templateUrl: './producto.component.html',
  styleUrl: './producto.component.css',
  host: {
    class: 'p-4',
  },
})
export class ProductoComponent implements OnInit {
  //*variables
  modalSwitch = signal<boolean>(false);
  agregar = signal<string>('Agregar Producto');
  //
  columnasTablas: any[] = [
    'nombre',
    'descripcionCategoria',
    'stock',
    'precio',
    'esActivo',
  ];
  dataInicio: Producto[] = [];
  dataListaProducto = signal<Producto[]>([]);
  editarPro = signal<string>('EditarProducto');
  private _productoService = inject(ProductoService);
  private _utilidadService = inject(UtilidadService);
  constructor() {}
  ngOnInit(): void {
    this.obtenerProducto();
  }
  obtenerProducto() {
    this._productoService.listar().subscribe({
      next: (data) => {
        console.log('inicio', data);
        if (data.status) this.dataListaProducto.set(data.value);
        else {
        }
      },
      error: (e) => {},
    });
  }
  ngAfterViewInit(): void {
    //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
    //Add 'implements AfterViewInit' to the class.
  }
  aplicarFiltroTabla(event: Event) {
    console.log('entrar', event.target);
    const filterValue = (event.target as HTMLInputElement).value
      .trim()
      .toLocaleLowerCase();
    if (filterValue === '') {
      this.obtenerProducto();
    }

    this.dataListaProducto.update((product) => {
      return product.filter((elemen) => {
        return elemen.nombre.toLocaleLowerCase().includes(filterValue);
      });
    });
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

  editarProducto() {
    //modal
  }
  eliminarProducto(producto: Producto) {
    Swal.fire({
      title: 'Desea eliminar el Producto?',
      text: producto.nombre,
      icon: 'warning',
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'si,eliminar',
      showCancelButton: true,
      cancelButtonColor: '#d33',
      cancelButtonText: 'No , volver',
    }).then((resultado) => {
      if (resultado.isConfirmed) {
        this._productoService.eliminar(producto.idProducto).subscribe({
          next: (data) => {
            if (data.status) this.obtenerProducto();
          },
        });
      }
    });
  }
}
