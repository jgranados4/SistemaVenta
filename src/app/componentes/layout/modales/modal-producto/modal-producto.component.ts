import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Producto } from '@core/interface';
import { CategoriaService } from '@core/services/categoria.service';
import { ProductoStoreService } from '@core/services/SignalStore/producto-store.service';
import { MaterialModule } from '@jgranados199795/apx-ui/apx-material';
import { ModalGenericoComponent } from '../modal-generico/modal-generico.component';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { showAlert } from '@shared/utility';
import { InputError } from '@shared/components/input-error/input-error';
import { limpiarPrecio } from '@shared/utility/parsePrecioApi';

@Component({
  selector: 'app-modal-producto',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MaterialModule,
    ModalGenericoComponent,
    MatDialogModule,
    InputError,
  ],
  templateUrl: './modal-producto.component.html',
  styleUrl: './modal-producto.component.css',
  
})
export class ModalProductoComponent {
  //*INJECT
  private fb = inject(FormBuilder);
  storeProd = inject(ProductoStoreService);
  private categoriaService = inject(CategoriaService);
  private dialogRef = inject(MatDialogRef<ModalProductoComponent>);
  private data = inject<{ data?: { producto?: Producto } }>(
    MAT_DIALOG_DATA
  );
  //*SIGNAL
  protected productoEditar = signal<Producto | undefined>(
    this.data.data?.producto
  );
  //*formulario
  formularioProducto: FormGroup = this.fb.group({
    nombre: ['', Validators.required],
    idCategoria: [1, Validators.required],
    stock: [0, Validators.required],
    precio: [0, Validators.required],
    esActivo: [1, Validators.required],
  });

  readonly titulo = computed(() =>
    this.productoEditar() ? 'Editar' : 'Agregar'
  );
  readonly botonAccion = computed(() =>
    this.titulo() === 'Editar' ? 'Actualizar' : 'Guardar'
  );
  readonly tituloModal = computed(() => `${this.titulo()} Producto`);
  readonly esEdicion = computed(() => this.titulo() === 'Editar');
  readonly valuesCategoria = computed(
    () => this.categoriaService.listar.value()?.value
  );
  constructor() {
    effect(() => {
      const dataproducto = this.productoEditar();
      if (dataproducto && this.esEdicion()) {
        const rawPrecio = dataproducto.precio;
         const precioLimpio = limpiarPrecio(rawPrecio);
        console.log('Cambios', rawPrecio, 'precios', precioLimpio);
        this.formularioProducto.patchValue({
          nombre: dataproducto.nombre,
          idCategoria: dataproducto.idCategoria,
          stock: dataproducto.stock,
          precio: precioLimpio, // Asignamos el número JS (2500.00)
          esActivo: dataproducto.esActivo.toString(),
        });
      } else {
        this.formularioProducto.reset({
          nombre: '',
          idCategoria: 1,
          stock: 0,
          precio: 0,
          esActivo: 1,
        });
      }
    });
  }
  GuardarEditar_producto() {
    if (this.formularioProducto.invalid) {
      this.formularioProducto.markAllAsTouched();
      return;
    }
    const ProductoAc = this.productoEditar();
    const idCategoria = parseInt(this.formularioProducto.value.idCategoria);
    const precioInput = this.formularioProducto.value.precio;
    const precioParaApi = Number(precioInput).toFixed(2).replace('.', ',');
    const _producto: Producto = {
      idProducto: ProductoAc?.idProducto ?? 0,
      nombre: this.formularioProducto.value.nombre,
      idCategoria: idCategoria,
      stock: this.formularioProducto.value.stock,
      precio: precioParaApi,
      esActivo: parseInt(this.formularioProducto.value.esActivo),
      descripcionCategoria: '',
    };
    const esEdicion = this.esEdicion();
    if (esEdicion) {
      console.log('contenido de la Editar', _producto);
      this.storeProd.actualizar(_producto).subscribe({
        next: () => {
          showAlert('¡Operación exitosa!', 'Editado correctamente.', 'success');
          this.dialogRef.close();
        },
        error: (err) => {
          console.error('Error al agregar el producto:', err);
        },
      });
    } else {
      console.log('contenido de la guardar', _producto);
      //Agregar
      this.storeProd.guardar(_producto).subscribe({
        next: () => {
          showAlert(
            '¡Operación exitosa!',
            'Agregado correctamente.',
            'success'
          );
          this.dialogRef.close();
        },
      });
    }
  }
}
