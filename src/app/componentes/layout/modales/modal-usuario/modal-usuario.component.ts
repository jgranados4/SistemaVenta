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
  FormsModule,
  ReactiveFormsModule,
  Validators,
  FormGroup,
} from '@angular/forms';
import {  Usuario } from '@core/interface';
// service
import { RolService } from '@core/services/rol.service';
import { Router } from '@angular/router';
import { MaterialModule } from '@jgranados199795/apx-ui/apx-material';
import { UsuarioStoreService } from '@core/services/SignalStore/usuario-store.service';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { ModalGenericoComponent } from '../modal-generico/modal-generico.component';
import { showAlert } from '@shared/utility';
@Component({
  selector: 'app-modal-usuario',
  standalone: true,
  imports: [
    MaterialModule,
    ReactiveFormsModule,
    FormsModule,
    MatDialogModule,
    ModalGenericoComponent,
  ],
  templateUrl: './modal-usuario.component.html',
  styleUrl: './modal-usuario.component.css',
  
  host: {
    class: 'block p-6',
  },
})
export class ModalUsuarioComponent {
  //injectar
  fb = inject(FormBuilder);
  router = inject(Router);
  private RolService = inject(RolService);
  private storeUs = inject(UsuarioStoreService);
  private dialogRef = inject(MatDialogRef<ModalUsuarioComponent>);
  private data = inject<{ data?: { usuario?: Usuario } }>(MAT_DIALOG_DATA);
  // Signals
  protected usuarioEditar = signal<Usuario | undefined>(
    this.data.data?.usuario
  );
  formularioUsuario: FormGroup = this.fb.group({
    nombreApellidos: ['', Validators.required],
    correo: ['', [Validators.required, Validators.email]],
    idRol: [1, Validators.required],
    clave: ['', Validators.required],
    esActivo: ['1', Validators.required],
  });
  //* COMPUTED
  readonly titulo = computed(() =>
    this.usuarioEditar() ? 'Editar' : 'Agregar'
  );
  readonly botonAccion = computed(() =>
    this.titulo() === 'Editar' ? 'Actualizar' : 'Guardar'
  );

  readonly valuesRoles = computed(() => this.RolService.listar.value()?.value);
  readonly tituloModal = computed(() => `${this.titulo()} Usuario`);
  readonly esEdicion = computed(() => this.titulo() === 'Editar');
  constructor() {
    effect(() => {
      const usuario = this.usuarioEditar();
      const esEdicion = this.esEdicion();
      console.log('🔄 Effect ejecutándose:', { usuario, esEdicion });
      console.log('data', this.data?.data?.usuario);
      if (usuario && esEdicion) {
        this.formularioUsuario.patchValue({
          nombreApellidos: usuario.nombreApellidos,
          correo: usuario.correo,
          idRol: usuario.idRol,
          clave: usuario.clave,
          esActivo: usuario.esActivo.toString(),
        });
      } else {
        this.formularioUsuario.reset({
          nombreApellidos: '',
          correo: '',
          idRol: 1,
          clave: '',
          esActivo: '1',
        });
      }
    });
  }
  //*METODO GUARDAR
  GuardarEditar_Ussuario() {
    const usuarioActual = this.usuarioEditar();
    const idRolSelec = parseInt(this.formularioUsuario.value.idRol);
    // const rolSeleccionado = this.ListarRoles().find(
    //   (r) => r.idRol === idRolSelec
    // );
    console.log('contenido', this.formularioUsuario.value);
    const _usuario: Usuario = {
      idUsuario: usuarioActual?.idUsuario ?? 0,
      nombreApellidos: this.formularioUsuario.value.nombreApellidos,
      correo: this.formularioUsuario.value.correo,
      clave: this.formularioUsuario.value.clave,
      idRol: idRolSelec,
      esActivo: parseInt(this.formularioUsuario.value.esActivo),
      rolDescripcion: '',
    };
    const esEdicion = this.esEdicion();
    if (esEdicion) {
      console.log('contenido de la Editar', _usuario);
      this.storeUs.actualizar(_usuario).subscribe({
        next: () => {
          console.log('Usuario Editado correctamente');
          showAlert('¡Operación exitosa!', 'Editado correctamente.', 'success');
          this.dialogRef.close();
        },
        error: (err) => {
          console.error('Error al agregar el usuario:', err);
        },
      });
    } else {
      console.log('agregar', _usuario);
      this.storeUs.guardar(_usuario).subscribe({
        next: () => {
          console.log('Usuario guardado correctamente');
          showAlert(
            '¡Operación exitosa!',
            'Agregado correctamente.',
            'success'
          );
          this.dialogRef.close();
        },
        error: (err) => {
          console.error('Error al agregar el usuario:', err);
        },
      });
    }
  }
}
