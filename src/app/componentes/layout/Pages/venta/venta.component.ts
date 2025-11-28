import {
  ChangeDetectionStrategy,
  Component,
  computed,
  ElementRef,
  inject,
  linkedSignal,
  signal,
  viewChild,
} from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
  FormGroup,
  FormGroupDirective,
} from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { Producto, Venta, detalleVentaDTOs, showAlert } from '@core/interface';
//*Servicios
import { VentaService } from '@core/services/venta.service';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { ProductoStoreService } from '@core/services/SignalStore/producto-store.service';
import { ApxTabla, TableColumn } from '@jgranados199795/apx-ui/apx-tabla';
import { MaterialModule } from '@jgranados199795/apx-ui/apx-material';

@Component({
  selector: 'app-venta',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    ApxTabla,
    MaterialModule,
    CurrencyPipe,
  ],
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
  //Signal
  listaProducto = signal<Producto[]>([]);
  listaProductoParaVenta = signal<detalleVentaDTOs[]>([]);
  bloqueoBotonRegistar = false;

  ProductoSeleccionado!: Producto;
  TipoPagoPorDefecto = 'Efectivo';
  //directivas
  formDirective = viewChild<FormGroupDirective>('formDirective');
  inputProductoRef = viewChild<ElementRef<HTMLInputElement>>('inputProducto');

  FormularioProductoVenta: FormGroup = this.fb.group({
    producto: ['', Validators.required],
    cantidad: ['', Validators.required],
    tipospago: [''],
  });
  columnasTablas: TableColumn<detalleVentaDTOs>[] = [
    { key: 'idProducto', label: 'ID' },
    { key: 'descripcionProducto', label: 'Descripcion' },
    { key: 'cantidad', label: 'Cantidad' },
    { key: 'precio', label: 'Precio' },
    { key: 'total', label: 'Total' },
  ];
  //⌨️Computed
  listaPto = computed(() => {
    const values = this._storePto
      .values()
      .filter((p) => p.esActivo === 1 && p.stock > 0);
    return values;
  });
  totalPagar = computed(() => {
    return this.listaProductoParaVenta().reduce(
      (acc: number, curr: detalleVentaDTOs) => acc + parseFloat(curr.total),
      0
    );
  });
  //toSignal
  private productoValue = toSignal(
    this.FormularioProductoVenta.get('producto')!.valueChanges,
    { initialValue: '' }
  );
  // Agrega esta función en tu clase del componente
  displayProducto(producto: Producto): string {
    return producto && producto.nombre ? producto.nombre : '';
  }
  listaProductoFiltro = linkedSignal(() => {
    const busqueda = this.productoValue();
    const lista = this.listaPto();

    if (!busqueda) return lista;

    const termino =
      typeof busqueda === 'string'
        ? busqueda.toLowerCase()
        : busqueda.nombre.toLowerCase();

    return lista.filter((p) => p.nombre.toLowerCase().includes(termino));
  });

  mostrarProducto(producto: Producto): string {
    return producto.nombre;
  }

  productoParaVenta(evento: Producto): void {
    if (evento && evento.precio) {
      this.ProductoSeleccionado = evento;
    }
  }
  agregarProductoVenta() {
    if (this.FormularioProductoVenta.invalid) return;

    const formValue = this.FormularioProductoVenta.getRawValue();
    const productoSeleccionado = formValue.producto;

    if (typeof productoSeleccionado === 'string' || !productoSeleccionado) {
      this.FormularioProductoVenta.controls['producto'].setErrors({
        invalidSelection: true,
      });
      return;
    }

    const cantidad = formValue.cantidad || 1;
    // Cálculos numéricos internos
    const precioBase = Number(productoSeleccionado.precio);;
    const totalLineaNum = precioBase * cantidad;

    this.listaProductoParaVenta.update((detalles) => {
      const existe = detalles.find(
        (d) => d.idProducto === productoSeleccionado.idProducto
      );

      if (existe) {
        return detalles.map((d) => {
          if (d.idProducto === productoSeleccionado.idProducto) {
            const nuevaCantidad = d.cantidad + cantidad;
            // Recalculamos el total numérico y luego convertimos a string
            const nuevoTotal = precioBase * nuevaCantidad;
            return {
              ...d,
              cantidad: nuevaCantidad,
              // Conversión a string para la interfaz
              total: nuevoTotal.toFixed(2),
            };
          }
          return d;
        });
      }

      return [
        ...detalles,
        {
          idProducto: productoSeleccionado.idProducto,
          descripcionProducto: productoSeleccionado.nombre,
          cantidad: cantidad,
          // Conversión a string para la interfaz
          precio: precioBase.toFixed(2),
          total: totalLineaNum.toFixed(2),
        },
      ];
    });

    this.resetearFormularioParcial();
  }

  eliminarProducto(detalle: detalleVentaDTOs) {
    this.listaProductoParaVenta.update((item) =>
      item.filter((p) => p.idProducto != detalle.idProducto)
    );
  }
  private resetearFormularioParcial() {
    // 1. Resetear valores del FormGroup
    // Mantenemos el tipo de pago para UX, reseteamos producto y cantidad
    this.FormularioProductoVenta.reset({
      producto: '',
      cantidad: 1,
      tipospago: this.FormularioProductoVenta.controls['tipospago'].value, // Mantener selección
    });

    // 2. CRITICO: Decirle al FormGroupDirective que el formulario está "pristine" de nuevo.
    // Esto elimina las clases de error rojas de Angular Material.
    if (this.formDirective()) {
      this.formDirective()!.resetForm({
        producto: '',
        cantidad: 1,
        tipospago: this.FormularioProductoVenta.controls['tipospago'].value,
      });
    }

    // 3. Hack pequeño para limpiar el input físico si el autocomplete se queda pegado
    if (this.inputProductoRef) {
      this.inputProductoRef()!.nativeElement.value = '';
    }
  }
  registrarVenta() {
     const listaActual = this.listaProductoParaVenta();
    console.log('Lista de producto de venta ', this.listaProductoParaVenta());
    if (this.listaProductoParaVenta().length > 0) {
      this.bloqueoBotonRegistar = true;
      console.log('Lista', this.listaProductoParaVenta());
      const request: Venta = {
        tipoPago:
          this.FormularioProductoVenta.controls['tipospago'].value ||
          'Efectivo',
        total: this.totalPagar().toFixed(2),
        detalleVentaDTOs: [...listaActual],
      };
      console.info('request',request)
      this._ventaService.registrar(request).subscribe({
        next: (response) => {
          if (response.status) {
            this.listaProductoParaVenta.set([]);
            showAlert(
              'Venta Registrada',
              `Numero de Venta  ${response.value.numeroDocumento}`,
              'success'
            );
          }
        },
        complete: () => {
          this.bloqueoBotonRegistar = false;
        },
      });
    }
  }
}
