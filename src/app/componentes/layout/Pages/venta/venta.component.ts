import {
  Component,
  computed,
  effect,
  inject,
  input,
  InputSignal,
  model,
  OnInit,
  output,
  signal,
} from '@angular/core';
import {
  FormBuilder,
  FormControlName,
  FormsModule,
  ReactiveFormsModule,
  Validators,
  FormGroup,
} from '@angular/forms';
import { Producto } from '@core/models/producto';
import { Venta } from '@core/models/venta';
import { detalleVentaDTOs } from '@core/models/detalle-venta';
//*Servicios
import { UtilidadService } from '@core/services/utilidad.service';
import { VentaService } from '@core/services/venta.service';
import { ProductoService } from '@core/services/producto.service';
//
import Swal from 'sweetalert2';
import { CommonModule } from '@angular/common';
import { TableRtzeComponent } from '@shared/components/table-rtze/table-rtze.component';

@Component({
  selector: 'app-venta',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule, TableRtzeComponent],
  templateUrl: './venta.component.html',
  styleUrl: './venta.component.css',
  host: {
    class: 'w-5/6 p-6 ',
  },
})
export class VentaComponent implements OnInit {
  //*Inject
  private fb = inject(FormBuilder);
  private _productoService = inject(ProductoService);
  private _ventaService = inject(VentaService);
  private _utilidadService = inject(UtilidadService);
  listaProducto = signal<Producto[]>([]);
  listaProductoFiltro = signal<Producto[]>([]);
  listaProductoParaVenta = signal<detalleVentaDTOs[]>([]);
  bloqueoBotonRegistar: boolean = false;

  ProductoSeleccionado!: Producto;
  TipoPagoPorDefecto: string = 'Efectivo';
  totalPagar = signal<number>(0);

  FormularioProductoVenta: FormGroup;
  columnasTablas: string[] = [
    'descripcionProducto',
    'cantidad',
    'precio',
    'total',
  ];
  datadetalleventa = computed(() => this.listaProductoParaVenta());
  RetornarProductoPorFiltro(busqueda: any): Producto[] {
    const valorbuscar =
      typeof busqueda === 'string'
        ? busqueda.toLocaleLowerCase()
        : busqueda.nombre.toLocaleLowerCase();

    return this.listaProducto().filter((it) =>
      it.nombre.toLocaleLowerCase().includes(valorbuscar)
    );
  }

  constructor() {
    this.FormularioProductoVenta = this.fb.group({
      producto: ['', Validators.required],
      cantidad: ['', Validators.required],
    });
    this._productoService.listar().subscribe({
      next: (data) => {
        if (data.status) {
          const list = data.value as Producto[];
          this.listaProducto.set(
            list.filter((p) => p.esActivo == 1 && p.stock > 0)
          );
        }
      },
      error: (e) => {},
    });
    this.FormularioProductoVenta.get('producto')?.valueChanges.subscribe(
      (value) => {
        this.listaProductoFiltro.set(this.RetornarProductoPorFiltro(value));
      }
    );
  }
  ngOnInit(): void {
    effect(() => {
      console.log('Cambios ', this.listaProducto());
      console.log('adsadsadsdsa', this.totalPagar());
    });
  }
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
      console.log('prodcutoseleccionado', this.ProductoSeleccionado.idProducto);
      console.log('formulario', this.FormularioProductoVenta.value);
      const cantidad: number = this.FormularioProductoVenta.value.cantidad;
      const precio: number = parseFloat(this.ProductoSeleccionado.precio);
      const total: number = cantidad * precio;
      this.totalPagar.update((current) => current + total);
      this.listaProductoParaVenta.update((item: detalleVentaDTOs[]) => {
        item.push({
          idProducto: this.ProductoSeleccionado.idProducto,
          descripcionProducto: this.ProductoSeleccionado.nombre,
          cantidad: cantidad,
          precio: String(precio.toFixed(2)),
          total: String(total.toFixed(2)),
        });
        return item;
      });
      this.FormularioProductoVenta.patchValue({
        producto: '',
        cantidad: '',
      });
      this.listaProductoFiltro.set([]);
    }
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
            Swal.fire({
              icon: 'success',
              title: 'Venta Registrada',
              text: `Numero de Venta  ${response.value.numeroDocumento}`,
            });
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
