import {
  Component,
  inject,
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
import { CategoriaService } from '@core/services/categoria.service';
import { ProductoService } from '@core/services/producto.service';

@Component({
  selector: 'app-modal-producto',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './modal-producto.component.html',
  styleUrl: './modal-producto.component.css',
})
export class ModalProductoComponent implements OnInit {
  //*Variables
  public dataProducto: Producto | null = null;
  //*INJECT
  private fb = inject(FormBuilder);
  private categoriaService = inject(CategoriaService);
  private productoService = inject(ProductoService);
  //*SIGNAL , INPUT Y OUTPUT
  tituloAccion = input<string>('Agregar Producto');
  datas = model<Producto | undefined>(undefined);
  close = output<boolean>();
  botonAccion = signal<string>('Guardar');
  //*formulario
  formularioProducto: FormGroup;

  listaCategoria: Categoria[] = [];

  constructor() {
    this.formularioProducto = this.fb.group({
      nombre: ['', Validators.required],
      idCategoria: ['', Validators.required],
      stock: ['', Validators.required],
      precio: ['', Validators.required],
      esActivo: ['1', Validators.required],
    });

    this.categoriaService.lista().subscribe({
      next: (data) => {
        if (data.status) this.listaCategoria = data.value;
      },
      error: (err) => {
        console;
      },
    });
  }
  ngOnInit(): void {
    if (this.dataProducto != null) {
      this.formularioProducto.patchValue({
        nombre: this.dataProducto.nombre,
        idCategoria: this.dataProducto.idCategoria,
        stock: this.dataProducto.stock,
        precio: this.dataProducto.precio,
        esActivo: this.dataProducto.esActivo.toString(),
      });
    }
    if (this.tituloAccion() === 'Editar Producto') {
      this.formularioProducto.patchValue(this.datas() ?? {});
    }
  }
  GuardarEditar_producto() {
    const _producto: Producto = {
      idProducto: this.dataProducto == null ? 0 : this.dataProducto.idProducto,
      nombre: this.formularioProducto.value.nombre,
      idCategoria: this.formularioProducto.value.idCategoria,
      stock: this.formularioProducto.value.stock,
      precio: this.formularioProducto.value.precio,
      esActivo: parseInt(this.formularioProducto.value.esActivo.toString()),
      descripcionCategoria: '',
    };
    console.log('clcicl', _producto);
    this.productoService.guardar(_producto).subscribe({
      next: (data) => {
        if (data.status) {
        } else {
        }
      },
      error: (err) => {
        console.error('problema ', err);
      },
    });
  }
  closeModal() {
    this.close.emit(false);
  }
  EditarProducto() {
    console.log('cabmaio', this.datas());
    const _producto: Producto = {
      idProducto: this.datas()?.idProducto || 0,
      nombre: this.formularioProducto.value.nombre,
      idCategoria: parseInt(this.formularioProducto.value.idCategoria),
      stock: this.formularioProducto.value.stock,
      precio: this.formularioProducto.value.precio.toString(),
      esActivo: parseInt(this.formularioProducto.value.esActivo.toString()),
      descripcionCategoria:
        this.listaCategoria.find(
          (rol) =>
            rol.idCategoria ===
            parseInt(this.formularioProducto.value.idCategoria)
        )?.descripcion || '',
    };
    console.log('Producros', _producto);
    this.productoService.editar(_producto).subscribe({
      next: (data) => {
        console.log('datassss', data);
        if (data.status) {
          this.closeModal();
          window.location.reload();
          this.ngOnInit();
        } else {
        }
      },
      error(err) {
        console.log('error ', err);
      },
    });
  }
}
