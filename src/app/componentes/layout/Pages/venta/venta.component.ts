import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  linkedSignal,
  signal,
} from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
  FormGroup,
} from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { Producto,Venta,
detalleVentaDTOs,
showAlert } from '@core/interface';
//*Servicios
import { VentaService } from '@core/services/venta.service';
import { CommonModule } from '@angular/common';
import { ProductoStoreService } from '@core/services/SignalStore/producto-store.service';
import {ApxTabla, TableColumn} from '@jgranados199795/apx-ui/apx-tabla'
@Component({
  selector: 'app-venta',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, ApxTabla],
  templateUrl: './venta.component.html',
  styleUrl: './venta.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'w-5/6 p-6 ',
  },
})
export class VentaComponent {
  //*Inject
  private fb = inject(FormBuilder);
  private _storePto = inject(ProductoStoreService);
  private _ventaService = inject(VentaService);
  listaProducto = signal<Producto[]>([]);
  listaProductoParaVenta = signal<detalleVentaDTOs[]>([]);
  bloqueoBotonRegistar: boolean = false;

  ProductoSeleccionado!: Producto;
  TipoPagoPorDefecto: string = 'Efectivo';
  totalPagar = signal<number>(0);

  FormularioProductoVenta: FormGroup = this.fb.group({
    producto: ['', Validators.required],
    cantidad: ['', Validators.required],
  });
  columnasTablas: any[] = [
    {key:'idProducto',label:'ID'},
    {key:'descripcionProducto',label:'Descripcion'},
    {key:'cantidad',label:'Cantidad'},
    {key:'precio',label:'Precio'},
    {key:'total',label:'Total'},
  ];
  datadetalleventa = computed(() => this.listaProductoParaVenta());
  listaPto = computed(() => {
    const values = this._storePto
      .values()
      .filter((p) => p.esActivo === 1 && p.stock > 0);
    return values;
  });
  RetornarProductoPorFiltro(busqueda: any): Producto[] {
    const valorbuscar =
      typeof busqueda === 'string'
        ? busqueda.toLocaleLowerCase()
        : busqueda.nombre.toLocaleLowerCase();

    return this.listaPto().filter((it) =>
      it.nombre.toLocaleLowerCase().includes(valorbuscar)
    );
  }
  private productoValue = toSignal(
    this.FormularioProductoVenta.get('producto')!.valueChanges,
    { initialValue: '' }
  );
  listaProductoFiltro = linkedSignal<Producto[]>(() =>
    this.RetornarProductoPorFiltro(this.productoValue())
  );

  mostrarProducto(producto: Producto): string {
    return producto.nombre;
  }
  productoParaVenta(evento: any) {
    if (evento && evento.precio) {
      this.ProductoSeleccionado = evento;
      this.FormularioProductoVenta.patchValue({ producto: evento.nombre });
    }
  }
  agregarProductoVenta() {
    if (
      this.ProductoSeleccionado &&
      typeof this.ProductoSeleccionado.precio === 'string'
    ) {
      console.log('formulario', this.FormularioProductoVenta.value);
      const cantidad: number = this.FormularioProductoVenta.value.cantidad;
      const precio: number = parseFloat(this.ProductoSeleccionado.precio);
      const total: number = cantidad * precio;
      this.totalPagar.update((current) => current + total);
      this.listaProductoParaVenta.update((item: detalleVentaDTOs[]) => [
        ...item,
        {
          idProducto: this.ProductoSeleccionado.idProducto,
          descripcionProducto: this.ProductoSeleccionado.nombre,
          cantidad: cantidad,
          precio: String(precio.toFixed(2)),
          total: String(total.toFixed(2)),
        },
      ]);
      this.FormularioProductoVenta.patchValue({
        producto: '',
        cantidad: '',
      });
      this.listaProductoFiltro.set([]);
    }
    console.log('lista', this.listaProductoParaVenta());
  }

  eliminarProducto(detalle: detalleVentaDTOs) {
    this.totalPagar.update((current) => current - parseFloat(detalle.total));
    this.listaProductoParaVenta.update((item) =>
      item.filter((p) => p.idProducto != detalle.idProducto)
    );
  }
  registrarVenta() {
    console.log('formula data ', this.datadetalleventa());
    if (this.listaProductoParaVenta().length > 0) {
      this.bloqueoBotonRegistar = true;
      console.log('Lista', this.listaProductoParaVenta());
      const request: Venta = {
        tipoPago: this.TipoPagoPorDefecto,
        total: String(this.totalPagar().toFixed(2)),
        detalleVentaDTOs: this.datadetalleventa(),
      };
      this._ventaService.registrar(request).subscribe({
        next: (response) => {
          if (response.status) {
            this.totalPagar.set(0.0);
            this.listaProductoParaVenta.set([]);
            showAlert(
              'Venta Registrada',
              `Numero de Venta  ${response.value.numeroDocumento}`,
              'success'
            );
          } else {
          }
        },
        complete: () => {
          this.bloqueoBotonRegistar = false;
        },
      });
    }
  }
}
