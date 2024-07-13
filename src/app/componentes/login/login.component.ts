import { Component, inject, NgModule, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { Login } from '../../core/models/login';
import { UsuarioService } from '@core/services/usuario.service';
import { UtilidadService } from '@core/services/utilidad.service';
import { NotificacionComponent } from '@shared/components/notificacion/notificacion.component';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, NotificacionComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  //inject
  form = inject(FormBuilder);
  router = inject(Router);
  private usuarioService = inject(UsuarioService);
  private utilidadService = inject(UtilidadService);
  //formulario
  formularioLogin: FormGroup;
  ocultarPassword: boolean = true;
  mostrarLoading: boolean = false;

  constructor() {
    this.formularioLogin = this.form.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
  }
  iniciarSesion() {
    console.log('ingreso');
    this.mostrarLoading = true;
    const request: Login = {
      correo: this.formularioLogin.value.email,
      clave: this.formularioLogin.value.password,
    };
    this.usuarioService.iniciarSesion(request).subscribe({
      next: (data) => {
        if (data.status) {
          this.utilidadService.guardarSesionUsuario(data.value);
          this.router.navigate(['pages']);
        } else {
          this.utilidadService.mostrarAlert(
            'No se econtraron conicidencias',
            'OPPS'
          );
        }
      },
      error: (error) => {
        console.log(error);
        this.utilidadService.mostrarAlert('Hubo un error', 'ERROR');
      },
      complete: () => {
        console.log('complete');
        this.mostrarLoading = false;
      },
    });
  }
}
