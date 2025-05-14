import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  EffectRef,
  inject,
  Injector,
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
import { Rol } from '@core/models/rol';
import { Usuario } from '@core/models/usuario';
// service
import { UsuarioService } from '@core/services/usuario.service';
import { RolService } from '@core/services/rol.service';
import { UtilidadService } from '@core/services/utilidad.service';
import { Router } from '@angular/router';
import { UsuarioStoreService } from '@core/services/SignalStore/usuario-store.service';
import { showAlert } from '@core/models/utility.Alert';

@Component({
  selector: 'app-modal-usuario',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule],
  templateUrl: './modal-usuario.component.html',
  styleUrl: './modal-usuario.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalUsuarioComponent {
  fb = inject(FormBuilder);
  router = inject(Router);
  inject = inject(Injector);
  ocultarPassword: boolean = true;
  ListarRoles = signal<Rol[]>([]);
  public usuarios: Usuario | null = null;
  //*output
  close = output<boolean>();
  //*input
  tituloAccion = input<string>('Agregar');
  datas = input<Usuario | undefined>(undefined);
  //*signal
  Titulo = signal<string>('Guardar');
  //injectar
  private RolService = inject(RolService);
  private UsuarioService = inject(UsuarioService);
  private storeUs = inject(UsuarioStoreService);
  formularioUsuario: FormGroup = this.fb.group({
    nombreApellidos: ['', Validators.required],
    correo: ['', [Validators.required, Validators.email]],
    idRol: ['', Validators.required],
    clave: ['', Validators.required],
    esActivo: ['1', Validators.required],
  });
  //* COMPUTED
  readonly botonAccion = computed(() =>
    this.tituloAccion() === 'Editar' ? 'Actualizar' : 'Guardar'
  );
  constructor() {}
  effectos = effect(
    () => {
      this.cargarRoles();
      const dataUsuario = this.datas();
      if (dataUsuario && this.tituloAccion() === 'Editar') {
        this.formularioUsuario.patchValue({
          nombreApellidos: dataUsuario.nombreApellidos,
          correo: dataUsuario.correo,
          idRol: dataUsuario.idRol,
          clave: dataUsuario.clave,
          esActivo: dataUsuario.esActivo.toString(),
        });
      } else {
        this.formularioUsuario.reset({
          nombreApellidos: '',
          correo: '',
          idRol: '',
          clave: '',
          esActivo: '1',
        });
      }
    },
    {
      injector: this.inject,
    }
  );
  cargarRoles() {
    this.RolService.lista().subscribe({
      next: (data) => {
        if (data.status) this.ListarRoles.set(data.value);
      },
      error: (e) => {
        console.error(e);
      },
    });
  }

  //*METODO GUARDAR
  GuardarEditar_Ussuario() {
    const _usuario: Usuario = {
      idUsuario: this.datas()?.idUsuario ?? 0,
      nombreApellidos: this.formularioUsuario.value.nombreApellidos,
      correo: this.formularioUsuario.value.correo,
      clave: this.formularioUsuario.value.clave,
      idRol: this.formularioUsuario.value.idRol,
      esActivo: parseInt(this.formularioUsuario.value.esActivo),
      rolDescripcion: '',
    };
    console.log('contenido de la Editar', _usuario);
    if (this.tituloAccion() === 'Editar') {
      this.UsuarioService.editar(_usuario).subscribe({
        next: (data) => {
          console.log('datassss', data);
          if (data.status) {
          } else {
          }
        },
        error(err) {
          console.log('error ', err);
        },
      });
      this.closeModal();
    } else {
      this.storeUs.guardar(_usuario).subscribe({
        next: () => {
          console.log('Usuario eliminado correctamente');
          showAlert(
            '¡Operación exitosa!',
            'Agregado correctamente.',
            'success'
          );
        },
        error: (err) => {
          console.error('Error al agregar el usuario:', err);
        },
      });
      this.closeModal();
    }
  }

  closeModal() {
    this.close.emit(false);
  }
}
