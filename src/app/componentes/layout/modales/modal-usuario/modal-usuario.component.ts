import {
  Component,
  effect,
  inject,
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

@Component({
  selector: 'app-modal-usuario',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule],
  templateUrl: './modal-usuario.component.html',
  styleUrl: './modal-usuario.component.css',
})
export class ModalUsuarioComponent implements OnInit {
  fb = inject(FormBuilder);
  router = inject(Router);
  formularioUsuario: FormGroup;
  ocultarPassword: boolean = true;
  ListarRoles: Rol[] = [];
  public usuarios: Usuario | null = null;
  //*output
  close = output<boolean>();
  //*input
  tituloAccion = input<string>('Agregar');
  datas = model<Usuario | undefined>(undefined);
  //*signal
  botonAccion = signal<string>('Guardar');
  //injectar
  private RolService = inject(RolService);
  private UsuarioService = inject(UsuarioService);
  private UtilidadService = inject(UtilidadService);
  constructor() {
    this.formularioUsuario = this.fb.group({
      nombreApellidos: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      idRol: ['', Validators.required],
      clave: ['', Validators.required],
      esActivo: ['1', Validators.required],
    });
    //
    if (this.usuarios != null) {
      this.botonAccion.set('Actualizar');
    }
    this.RolService.lista().subscribe({
      next: (data) => {
        if (data.status) this.ListarRoles = data.value;
      },
      error: (e) => {
        console.error(e);
      },
    });
    effect(() => {
      console.log('este efecto ', this.datas());
    });
  }
  ngOnInit(): void {
    if (this.usuarios != null) {
      this.formularioUsuario.patchValue({
        nombreApellidos: this.usuarios.nombreApellidos,
        correo: this.usuarios.correo,
        idRol: this.usuarios.idRol,
        clave: this.usuarios.clave,
        esActivo: this.usuarios.esActivo.toString(),
      });
    }
    if (this.tituloAccion() === 'Editar') {
      this.formularioUsuario.patchValue(this.datas() ?? {});
    }
  }

  //*METODO GUARDAR
  GuardarEditar_Ussuario() {
    const _usuario: Usuario = {
      idUsuario: this.usuarios == null ? 0 : this.usuarios.idUsuario,
      nombreApellidos: this.formularioUsuario.value.nombreApellidos,
      correo: this.formularioUsuario.value.correo,
      clave: this.formularioUsuario.value.clave,
      idRol: this.formularioUsuario.value.idRol,
      esActivo: parseInt(this.formularioUsuario.value.esActivo),
      rolDescripcion: '',
    };
    this.UsuarioService.guardar(_usuario).subscribe({
      next: (data) => {
        if (data.status) {
          this.UtilidadService.mostrarAlert('El usuarios fue Registro', 'OPPS');
          this.closeModal();
          window.location.reload();
          this.ngOnInit();
        } else {
          this.UtilidadService.mostrarAlert(
            'No puedo registrar el usuarios',
            'ERROR'
          );
        }
      },
    });
  }
  //*Editar
  EditarUsuario() {
    console.log('click');
    console.log('usuariosssssssss', this.datas());
    const _usuario: Usuario = {
      idUsuario: this.datas()?.idUsuario || 0,
      nombreApellidos: this.formularioUsuario.value.nombreApellidos,
      correo: this.formularioUsuario.value.correo,
      clave: this.formularioUsuario.value.clave,
      idRol: parseInt(this.formularioUsuario.value.idRol),
      esActivo: parseInt(this.formularioUsuario.value.esActivo),
      rolDescripcion:
        this.ListarRoles.find(
          (rol) => rol.idRol === parseInt(this.formularioUsuario.value.idRol)
        )?.descripcion || '',
    };
    console.log('usuarios editadps', _usuario);
    this.UsuarioService.editar(_usuario).subscribe({
      next: (data) => {
        console.log('datassss', data);
        if (data.status) {
          this.UtilidadService.mostrarAlert('El usuarios fue Editado', 'OPPS');
          this.closeModal();
          window.location.reload();
          this.ngOnInit();
        } else {
          this.UtilidadService.mostrarAlert('No puedo editarse', 'ERROR');
        }
      },
      error(err) {
        console.log('error ', err);
      },
    });
  }

  closeModal() {
    this.close.emit(false);
  }
}
