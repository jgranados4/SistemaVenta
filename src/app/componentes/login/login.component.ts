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
import { CommonModule } from '@angular/common';
import { debounceTime, distinctUntilChanged } from 'rxjs';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, CommonModule],
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
  formularioLogin: FormGroup = this.form.group({
    email: this.form.nonNullable.control('', Validators.required),
    password: this.form.nonNullable.control('', Validators.required),
  });
  ocultarPassword: boolean = true;
  mostrarLoading: boolean = false;

  constructor() {
    this.formularioLogin
      .get('email')
      ?.valueChanges.pipe(debounceTime(1000), distinctUntilChanged())
      .subscribe((value) => console.log(value));
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
        }
      },
      error: (error) => {
        console.log(error);
      },
      complete: () => {
        console.log('complete');
        this.mostrarLoading = false;
      },
    });
  }
  //Validaccion
  HasRequiredError(field: string) {
    const control = this.formularioLogin.get(field);
    return control?.hasError('required') && control.touched;
  }
}
