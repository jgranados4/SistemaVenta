import { ChangeDetectionStrategy, Component, computed, effect, inject, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { detalleVentaDTOs, ventaHistorialResponse } from '@core/interface';
import { MaterialModule } from '@jgranados199795/apx-ui/apx-material';
import { ApxTabla, TableColumn } from '@jgranados199795/apx-ui/apx-tabla';
import { ModalGenericoComponent } from '../modal-generico/modal-generico.component';
import { InputError } from '@shared/components/input-error/input-error';
import { limpiarPrecio } from '@shared/utility/parsePrecioApi';

@Component({
  selector: 'app-modal-detalle-venta',
  imports: [
    MaterialModule,
    ReactiveFormsModule,
    ModalGenericoComponent,
    MatDialogModule,
    ApxTabla,
    InputError,
  ],
  templateUrl: './modal-detalle-venta.html',
  styleUrl: './modal-detalle-venta.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalDetalleVenta {
  //Variables
  columnaTabla: TableColumn<detalleVentaDTOs>[] = [
    {
      key: 'idProducto', // La propiedad en detalleVentaDTOs
      label: 'Producto', // El título visible en la tabla
    },
    {
      key: 'cantidad',
      label: 'Cantidad',
    },
    {
      key: 'precio',
      label: 'Precio Unitario',
    },
    {
      key: 'total',
      label: 'Total',
    },
  ];
  private venta = inject<{ data?: { historial: ventaHistorialResponse } }>(
    MAT_DIALOG_DATA
  );
  private fb = inject(FormBuilder);
  protected detalle = signal<ventaHistorialResponse | undefined>(
    this.venta.data?.historial
  );
  formularioDetalle: FormGroup = this.fb.group({
    fechaRegistro: ['', Validators.required],
    numeroVenta: ['', Validators.required],
    tipoPago: ['', Validators.required],
    total: [null, Validators.required],
  });
  constructor() {
    effect(() => {
      const detalle = this.detalle();
      if (detalle) {
        const rawPrecio=detalle.total;
        const totalPar = limpiarPrecio(rawPrecio);
        console.log('precio', rawPrecio, 'parseado', totalPar);
        this.formularioDetalle.patchValue({
          fechaRegistro: detalle.fechaRegistro,
          numeroVenta: detalle.numeroDocumento,
          tipoPago: detalle.tipoPago,
          total: totalPar,
        });
      }
    });
  }
  readonly titulo = computed(() => (this.detalle() ? 'Editar' : 'Agregar'));

  readonly tituloModal = computed(() => `${this.titulo()} DetalleVenta`);
  readonly detalleVenta = computed(() => this.detalle()?.detalleVentaResponseDTOs);
}