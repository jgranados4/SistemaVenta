import { Component, inject, OnInit, signal } from '@angular/core';
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
import { UsuarioComponent } from '../../Pages/usuario/usuario.component';

@Component({
  selector: 'app-modal-usuario',
  standalone: true,
  imports: [ReactiveFormsModule, FormsModule],
  templateUrl: './modal-usuario.component.html',
  styleUrl: './modal-usuario.component.css',
})
export class ModalUsuarioComponent implements OnInit {
  fb = inject(FormBuilder);
  formularioUsuario: FormGroup;
  ocultarPassword: boolean = true;
  tituloAccion = signal<string>('Agregar');
  botonAccion = signal<string>('Guardar');
  ListarRoles: Rol[] = [];
  public usuarios: Usuario | null = null;
  modelusuario: UsuarioComponent = new UsuarioComponent();
  //injectar
  private RolService = inject(RolService);
  private UsuarioService = inject(UsuarioService);
  private UtilidadService = inject(UtilidadService);
  constructor() {
    this.formularioUsuario = this.fb.group({
      nombreCompleto: ['', Validators.required],
      correo: ['', [Validators.required, Validators.email]],
      idRol: ['', Validators.required],
      clave: ['', Validators.required],
      esActivo: ['1', Validators.required],
    });
    //
    if (this.usuarios != null) {
      this.tituloAccion.set('Editar');
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
  }
  ngOnInit(): void {
    if (this.usuarios != null) {
      this.formularioUsuario.patchValue({
        nombreCompleto: this.usuarios.nombreCompleto,
        correo: this.usuarios.correo,
        idRol: this.usuarios.idRol,
        clave: this.usuarios.clave,
        esActivo: this.usuarios.esActivo.toString(),
      });
    }
  }

  //*METODO GUARDAR
  GuardarEditar_Ussuario() {
    const _usuario: Usuario = {
      idUsuario: this.usuarios == null ? 0 : this.usuarios.idUsuario,
      nombreCompleto: this.formularioUsuario.value.nombreCompleto,
      correo: this.formularioUsuario.value.correo,
      clave: this.formularioUsuario.value.clave,
      idRol: this.formularioUsuario.value.idRol,
      esActivo: parseInt(this.formularioUsuario.value.esActivo),
      rolDescripcion: '',
    };
    if (this.usuarios == null) {
      this.UsuarioService.guardar(_usuario).subscribe({
        next: (data) => {
          if (data.status) {
            this.UtilidadService.mostrarAlert(
              'El usuarios fue Registro',
              'OPPS'
            );
            this.modelusuario;
          } else {
            this.UtilidadService.mostrarAlert(
              'No puedo registrar el usuarios',
              'ERROR'
            );
          }
        },
      });
    }
  }
}
