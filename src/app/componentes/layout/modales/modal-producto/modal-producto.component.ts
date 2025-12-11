import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  Injector,
  input,
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

@Component({
  selector: 'app-modal-producto',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MaterialModule,
    ModalGenericoComponent,
    MatDialogModule,
  ],
  templateUrl: './modal-producto.component.html',
  styleUrl: './modal-producto.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalProductoComponent {
  //*INJECT
  private fb = inject(FormBuilder);
  inject = inject(Injector);
  storeProd = inject(ProductoStoreService);
  private categoriaService = inject(CategoriaService);
  private dialogRef = inject(MatDialogRef<ModalProductoComponent>);
  private data = inject<{ data?: { producto?: Producto } }>(MAT_DIALOG_DATA);
  //*SIGNAL , INPUT Y OUTPUT`
  datas = input<Producto | undefined>(undefined);
  protected productoEditar = signal<Producto | undefined>(
    this.data.data?.producto
  );
  //*formulario
  formularioProducto: FormGroup = this.fb.group({
    nombre: ['', Validators.required],
    idCategoria: [1, Validators.required],
    stock: [0, Validators.required],
    precio: ['', Validators.required],
    esActivo: ['1', Validators.required],
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
      console.log('dialog data', dataproducto);
      const esEdicion = this.esEdicion();
      if (dataproducto && esEdicion) {
        this.formularioProducto.patchValue({
          nombre: dataproducto.nombre,
          idCategoria: dataproducto.idCategoria,
          stock: dataproducto.stock,
          precio: dataproducto.precio,
          esActivo: dataproducto.esActivo.toString(),
        });
      } else {
        this.formularioProducto.reset({
          nombre: '',
          idCategoria: 1,
          stock: '',
          precio: '',
          esActivo: '1',
        });
      }
    });
  }
  GuardarEditar_producto() {
    const ProductoAc = this.productoEditar();
    const idCategoria = parseInt(this.formularioProducto.value.idCategoria);
    // const IdCateSelec = this.listaCategoria().find(
    //   (Ca) => Ca.idCategoria === idCategoria
    // );

    const _producto: Producto = {
      idProducto: ProductoAc?.idProducto ?? 0,
      nombre: this.formularioProducto.value.nombre,
      idCategoria: idCategoria,
      stock: this.formularioProducto.value.stock,
      precio: String(this.formularioProducto.value.precio),
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
