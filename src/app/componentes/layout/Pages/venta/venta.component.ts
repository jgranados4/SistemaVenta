import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  signal,
  viewChild,
} from '@angular/core';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators,
  
  FormGroupDirective,
  FormControl,
} from '@angular/forms';
import { toSignal } from '@angular/core/rxjs-interop';
import { Producto, VentaForm, VentaRequest, detalleVentaDTOs } from '@core/interface';
//*Servicios
import { VentaService } from '@core/services/venta.service';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { ProductoStoreService } from '@core/services/SignalStore/producto-store.service';
import { ApxTabla, TableAction, TableColumn } from '@jgranados199795/apx-ui/apx-tabla';
import { MaterialModule } from '@jgranados199795/apx-ui/apx-material';
import { showAlert } from '@shared/utility';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { InputError } from '@shared/components/input-error/input-error';
import { limpiarPrecio } from '@shared/utility/parsePrecioApi';

@Component({
  selector: 'app-venta',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    CommonModule,
    ApxTabla,
    MaterialModule,
    CurrencyPipe,
    InputError,
  ],
  providers: [CurrencyPipe],
  templateUrl: './venta.component.html',
  styleUrl: './venta.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block w-5/6 p-6 mx-auto',
  },
})
export class VentaComponent {
  private readonly _fb = inject(FormBuilder);
  private readonly _storePto = inject(ProductoStoreService);
  private readonly _ventaService = inject(VentaService);
  private readonly _currencyPipe = inject(CurrencyPipe);

  readonly formularioVenta = this._fb.group<VentaForm>({
    productoBusqueda: new FormControl<string | Producto>('', {
      nonNullable: true,
      validators: [Validators.required],
    }),
    cantidad: new FormControl<number>(1, {
      nonNullable: true,
      validators: [Validators.required, Validators.min(1)],
    }),
    tipoPago: new FormControl<string>('Efectivo', { nonNullable: true }),
  });

  // Signals
  readonly productoSeleccionado = signal<Producto | null>(null); // Usamos la interfaz UI
  readonly listaDetalleVenta = signal<detalleVentaDTOs[]>([]);
  readonly procesandoVenta = signal<boolean>(false);

  readonly formDirective = viewChild<FormGroupDirective>('formDirective');
  readonly inputCantidad =
    viewChild<ElementRef<HTMLInputElement>>('inputCantidadRef');

  private readonly terminoBusqueda = toSignal(
    this.formularioVenta.controls.productoBusqueda.valueChanges,
    { initialValue: '' }
  );

  // 4. SOLUCIÓN AQUÍ: "Adaptador de Datos"
  // Transformamos los datos en la Signal. Así el HTML recibe números limpios.
  readonly productosFiltrados = computed<Producto[]>(() => {
    const termino = this.terminoBusqueda();
    const todos = this._storePto
      .values()
      .filter((p) => p.esActivo === 1 && p.stock > 0)
      .map((p) => ({
        ...p,
        precio: limpiarPrecio(p.precio),
      }));

    if (!termino || typeof termino !== 'string') return todos;

    const terminoLower = termino.toLowerCase();
    return todos.filter((p) => p.nombre.toLowerCase().includes(terminoLower));
  });
  readonly datosTablaVisual = computed(() => {
    const rawData = this.listaDetalleVenta();

    return rawData.map((item) => ({
      ...item,
      // Usamos el pipe inyectado. Automáticamente usa 'es-EC' de tu app.config
      // Argumentos: valor, codigoMoneda, mostrarSimbolo, formatoDigitos
      precio:
        this._currencyPipe.transform(item.precio, 'USD', 'symbol', '1.2-2') ||
        '$ 0,00',
      total:
        this._currencyPipe.transform(item.total, 'USD', 'symbol', '1.2-2') ||
        '$ 0,00',
    }));
  });

  readonly totalPagar = computed(() => {
    // Ahora es una suma simple, sin pipes ni transformaciones extrañas
    return this.listaDetalleVenta().reduce((acc, curr) => {
      // El total en DTO sigue siendo string para la API, así que lo parseamos simple
      return acc + parseFloat(curr.total);
    }, 0);
  });

  readonly columnasTabla: TableColumn<detalleVentaDTOs>[] = [
    { key: 'idProducto', label: 'ID' },
    { key: 'descripcionProducto', label: 'Descripción' },
    { key: 'cantidad', label: 'Cant.' },
    { key: 'precio', label: 'P. Unit' },
    { key: 'total', label: 'Total' },
  ];
  constructor(){
    effect(()=>{
      console.log()
    })
  }
  displayProducto(producto: Producto): string {
    return producto && producto.nombre ? producto.nombre : '';
  }

  onProductoSeleccionado(event: MatAutocompleteSelectedEvent): void {
    // Al venir del autocomplete, ya viene como ProductoUI (con precio numérico)
    const producto: Producto = event.option.value;
    this.productoSeleccionado.set(producto);

    setTimeout(() => {
      this.inputCantidad()?.nativeElement.select();
    }, 100);
  }

  agregarProducto(): void {
    if (this.formularioVenta.invalid) {
      this.formularioVenta.markAllAsTouched();
      return;
    }

    const { productoBusqueda, cantidad } = this.formularioVenta.getRawValue();
    const producto = this.productoSeleccionado();

    // Verificación robusta
    const esObjetoValido =
      typeof productoBusqueda === 'object' &&
      productoBusqueda?.idProducto === producto?.idProducto;
    const esTextoValido =
      typeof productoBusqueda === 'string' &&
      productoBusqueda === producto?.nombre;

    if (!producto || (!esObjetoValido && !esTextoValido)) {
      this.formularioVenta.controls.productoBusqueda.setErrors({
        invalidSelection: true,
      });
      showAlert(
        'Atención',
        'Seleccione un producto válido de la lista',
        'warning'
      );
      return;
    }

    // 5. Lógica Simplificada: Ya tenemos el precio como número
    const precioUnitario = producto.precio as number;
    console.log('precio', precioUnitario);

    if (precioUnitario <= 0) {
      showAlert('Error', 'El precio del producto no es válido', 'error');
      return;
    }

    const totalLinea = precioUnitario * cantidad;

    this.listaDetalleVenta.update((actual) => {
      const index = actual.findIndex(
        (d) => d.idProducto === producto.idProducto
      );

      if (index >= 0) {
        const items = [...actual];
        const item = items[index];
        const nuevaCantidad = item.cantidad + cantidad;
        const nuevoTotal = precioUnitario * nuevaCantidad;

        items[index] = {
          ...item,
          cantidad: nuevaCantidad,
          // Guardamos string para la API, pero usamos punto decimal standard para JSON
          total: nuevoTotal.toFixed(2),
        };
        return items;
      }

      return [
        ...actual,
        {
          idProducto: producto.idProducto,
          descripcionProducto: producto.nombre,
          cantidad: cantidad,
          precio: precioUnitario.toFixed(2),
          total: totalLinea.toFixed(2),
        },
      ];
    });

    this.resetearFormularioParcial();
  }

  registrarVenta(): void {
    const detalles = this.listaDetalleVenta();
    if (detalles.length === 0) return;

    this.procesandoVenta.set(true);

    const ventaPayload: VentaRequest = {
      tipoPago: this.formularioVenta.controls.tipoPago.value,
      total: this.totalPagar().toFixed(2),
      detalleVentaDTOs: detalles,
    };

    this._ventaService.registrar(ventaPayload).subscribe({
      next: (resp) => {
        if (resp.status) {
          this.listaDetalleVenta.set([]);
          showAlert(
            'Venta Exitosa',
            `Ticket: ${resp.value.numeroDocumento}`,
            'success'
          );

          this.formDirective()?.resetForm({
            tipoPago: 'Efectivo',
            cantidad: 1,
          });
          this.formularioVenta.reset({
            tipoPago: 'Efectivo',
            cantidad: 1,
            productoBusqueda: '',
          });
        }
      },
      error: (err) => {
        console.error(err);
        showAlert('Error', 'No se pudo procesar la venta', 'error');
      },
      complete: () => this.procesandoVenta.set(false),
    });
  }

  handleDelete(action: TableAction<detalleVentaDTOs>): void {
    this.listaDetalleVenta.update((lista) =>
      lista.filter((item) => item.idProducto !== action.row.idProducto)
    );
  }

  private resetearFormularioParcial(): void {
    this.formularioVenta.controls.productoBusqueda.setValue('');
    this.formularioVenta.controls.cantidad.setValue(1);
    this.formularioVenta.controls.productoBusqueda.setErrors(null);
    this.productoSeleccionado.set(null);
  }
}
