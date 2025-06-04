import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  inject,
  Injector,
  input,
  model,
  OnInit,
  output,
  signal,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Categoria } from '@core/models/categoria';
import { Producto } from '@core/models/producto';
import { showAlert } from '@core/models/utility.Alert';
import { CategoriaService } from '@core/services/categoria.service';
import { ProductoService } from '@core/services/producto.service';
import { ProductoStoreService } from '@core/services/SignalStore/producto-store.service';

@Component({
  selector: 'app-modal-producto',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './modal-producto.component.html',
  styleUrl: './modal-producto.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalProductoComponent {
  //*Variables
  public dataProducto: Producto | null = null;
  //*INJECT
  private fb = inject(FormBuilder);
  inject = inject(Injector);
  storeProd = inject(ProductoStoreService);
  private categoriaService = inject(CategoriaService);
  //*SIGNAL , INPUT Y OUTPUT`
  tituloAccion = input<string>('Agregar Producto');
  datas = input<Producto | undefined>(undefined);
  close = output<boolean>();
  //*formulario
  formularioProducto: FormGroup = this.fb.group({
    nombre: ['', Validators.required],
    idCategoria: [1, Validators.required],
    stock: [0, Validators.required],
    precio: ['', Validators.required],
    esActivo: ['1', Validators.required],
  });

  readonly botonAccion = computed(() =>
    this.tituloAccion() === 'Editar' ? 'Actualizar' : 'Guardar'
  );
  listaCategoria = signal<Categoria[]>([]);
  readonly Categorias = computed(() => this.listaCategoria());
  effectos = effect(
    () => {
      this.cargarCategoria();
      const dataproducto = this.datas();
      if (dataproducto && this.tituloAccion() === 'Editar Producto') {
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
          esActivo: 0,
        });
      }
    },
    {
      injector: this.inject,
    }
  );

  cargarCategoria(): void {
    this.categoriaService.lista().subscribe({
      next: (data) => {
        if (data.status) this.listaCategoria.set(data.value);
      },
      error: (err) => {
        console.log(err);
      },
    });
  }
  GuardarEditar_producto() {
    const ProductoAc = this.datas();
    const idCategoria = parseInt(this.formularioProducto.value.idCategoria);
    const IdCateSelec = this.listaCategoria().find(
      (Ca) => Ca.idCategoria === idCategoria
    );
    console.log('formulario', this.formularioProducto.value);
    console.log('idCat', idCategoria);
    console.log('seleciones', IdCateSelec);
    console.log('titulo', this.tituloAccion());
    console.log('listasCate', this.listaCategoria());
    const _producto: Producto = {
      idProducto: ProductoAc?.idProducto ?? 0,
      nombre: this.formularioProducto.value.nombre,
      idCategoria: idCategoria,
      stock: this.formularioProducto.value.stock,
      precio: this.formularioProducto.value.precio,
      esActivo: parseInt(this.formularioProducto.value.esActivo.toString()),
      descripcionCategoria: IdCateSelec?.descripcion ?? '',
    };
    if (this.tituloAccion() === 'Editar Producto') {
      console.log('contenido de la Editar', _producto);
      this.storeProd.actualizar(_producto).subscribe({
        next: () => {
          showAlert('¡Operación exitosa!', 'Editado correctamente.', 'success');
        },
        error: (err) => {
          console.error('Error al agregar el producto:', err);
        },
      });
      this.closeModal();
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
        },
      });
      this.closeModal();
    }
  }
  closeModal() {
    this.close.emit(false);
  }
}
