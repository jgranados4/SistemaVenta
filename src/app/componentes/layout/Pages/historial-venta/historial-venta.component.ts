import { ChangeDetectionStrategy, Component, computed, effect, inject, signal } from '@angular/core';
import {  FormGroup, NonNullableFormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ModalDetalleVenta } from '@component/layout/modales/modal-detalle-venta/modal-detalle-venta';
import { FiltrosHistorial, historialColumna, historialForm, opcionesBusqueda, ventaHistorialResponse } from '@core/interface/historialVenta';
import { ModalService, UtilidadService, VentaService } from '@core/services';
import { MaterialModule } from '@jgranados199795/apx-ui/apx-material';
import { ApxTabla,  TableAction,  TableColumn } from '@jgranados199795/apx-ui/apx-tabla';
import { showAlert } from '@shared/utility';
import {  formatFechaUniversal } from '@shared/utility/formatFecha';
import { MatCardModule } from '@angular/material/card';
import { InputError } from '@shared/components/input-error/input-error';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { CurrencyPipe } from '@angular/common';
import { limpiarPrecio } from '@shared/utility/parsePrecioApi';
export const MY_DATA_FORMS = {
  parse: {
    dateinput: 'DD/MM/YYYY',
  },
  display: {
    dateinput: 'DD/MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};
@Component({
  selector: 'app-historial-venta',
  imports: [
    ApxTabla,
    MaterialModule,
    MatCardModule,
    ReactiveFormsModule,
    InputError,
    MatIconModule,
    MatDividerModule,
  ],
  providers: [CurrencyPipe],
  templateUrl: './historial-venta.component.html',
  styleUrl: './historial-venta.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  host: {
    class: 'block w-5/6 p-6 mx-auto',
  },
})
export class HistorialVentaComponent {
  readonly #dialogModal = inject(ModalService);
  readonly #venta = inject(VentaService);
  readonly #utilidad = inject(UtilidadService);
  readonly #fb = inject(NonNullableFormBuilder);
  private readonly _currencyPipe = inject(CurrencyPipe);

  opcionesBusqueda: opcionesBusqueda[] = [
    { value: 'fecha', descripcion: 'por Fechas ' },
    { value: 'numero', descripcion: 'Numero de Ventas' },
  ];
  columnaTabla: TableColumn<historialColumna>[] = [
    { key: 'fechaRegistro', label: 'Fecha Registro' },
    { key: 'numeroDocumento', label: 'numero Documento' },
    { key: 'tipoPago', label: 'tipo Pago' },
    { key: 'total', label: 'Total' },
  ];
  readonly formularioBusqueda: FormGroup<historialForm> = this.#fb.group({
    buscarPor: ['fecha'],
    numero: [''],
    fechaInicio: [''],
    fechaFin: [''],
  });
  readonly filtroCliente = signal('');

  readonly filtrosBusqueda = signal<FiltrosHistorial>({
    buscarPor: '',
    numeroVenta: '',
    fechaInicio: '',
    fechaFin: '',
  });

  // 3. RECURSO REACTIVO (Declarado como propiedad, NO dentro de una función)
  // Escucha cambios en 'filtrosBusqueda'
  readonly historialResource = this.#venta.historialR(this.filtrosBusqueda);
  readonly resultadosRaw = computed(
    () => this.historialResource.value()?.value ?? []
  );
  readonly isLoading = computed(() => this.historialResource.isLoading());

  readonly listaFiltrada = computed(() => {
    const data = this.resultadosRaw();
    const filtro = this.filtroCliente().toLowerCase().trim();
    const dataFormateada = data.map((item: ventaHistorialResponse) => {
      const precioNumerico =limpiarPrecio(item.total);
      return {
        ...item, // Copiamos todas las propiedades originales
        total:
          this._currencyPipe.transform(
            precioNumerico,
            'USD',
            'symbol',
            '1.2-2'
          ) || '$ 0,00',
        fechaRegistro: formatFechaUniversal(item.fechaRegistro),
      };
    });
    if (!filtro) return dataFormateada;
    return dataFormateada.filter(
      (item: ventaHistorialResponse) =>
        item.numeroDocumento.toLowerCase().includes(filtro) ||
        item.total.toString().includes(filtro)
    );
  });
  constructor() {
    effect(() => {
      console.log('Cambios en effectos', this.listaFiltrada());
    });
  }

  // Para saber si mostramos la tabla (si ya se buscó al menos una vez y no hay error)
  readonly hasSearched = computed(
    () => this.filtrosBusqueda().buscarPor !== ''
  );

  aplicarFiltroTabla(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.filtroCliente.set(filterValue);
  }
  buscarVentas() {
    const { buscarPor, numero, fechaInicio, fechaFin } =
      this.formularioBusqueda.getRawValue();
    console.log('fechas', this.formularioBusqueda.getRawValue());
    // Validaciones
    if (buscarPor === 'fecha') {
      if (!fechaInicio || !fechaFin) {
        showAlert('Fecha Incompleta', 'Debe ingresar ambas fechas.', 'warning');
        return;
      }
    }
    // Formateo de fechas
    const fInicio = fechaInicio ? formatFechaUniversal(fechaInicio) : '';
    const fFin = fechaFin ? formatFechaUniversal(fechaFin) : '';
    this.filtrosBusqueda.set({
      buscarPor,
      numeroVenta: numero ?? '',
      fechaInicio: fInicio,
      fechaFin: fFin,
    });
  }
  handleEdit(event: TableAction<ventaHistorialResponse>): void {
    const historialEdi = {
      ...event.row,
      precio: event.row.total, // Recuperamos el numero
    };
    console.log("historail",event.row)
    this.#dialogModal.openModal<ModalDetalleVenta, unknown>(ModalDetalleVenta, {
      data: {
        historial: historialEdi,
      },
    });
  }
}
