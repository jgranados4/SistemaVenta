import { Component, inject, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ULogin } from '@core/interface';
import { UsuarioService } from '@core/services/usuario.service';
import { UtilidadService } from '@core/services/utilidad.service';
import {ApxFormulario,FieldConfig} from '@jgranados199795/apx-ui/apx-formulario';
import {MaterialModule} from '@jgranados199795/apx-ui/apx-material';

import { firstValueFrom } from 'rxjs';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, ReactiveFormsModule, ApxFormulario, MaterialModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  fields: FieldConfig[] = [
    {
      key: 'correo',
      type: 'email',
      label: 'Email',
      placeholder: 'name@company.com',
      required: true,
      fieldSize: 'full',
      validators: [{ name: 'required' }, { name: 'email' }],
    },
    {
      key: 'clave',
      type: 'password',
      label: 'Contraseña',
      placeholder: '••••••••',
      required: true,
      fieldSize: 'full',
      validators: [{ name: 'required' }],
    },
    {
      key: 'remember',
      type: 'checkbox',
      label: 'Remember me',
      value: false,
    },
  ];
  //inject
  router = inject(Router);
  private usuarioService = inject(UsuarioService);
  private utilidadService = inject(UtilidadService);

  mostrarLoading: boolean = false;

  constructor() {}
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
  }

  async onSubmit(formData: Record<string, unknown>) {
    this.mostrarLoading = true;
    console.log('Form data:', formData);
    const loginData = formData as ULogin;
    console.log('DATA:', loginData);

    try {
      const data = await firstValueFrom(
        this.usuarioService.iniciarSesion(loginData)
      );
      if (data.status) {
        this.utilidadService.guardarSesionUsuario(data.value);
        await this.router.navigate(['pages']);
      } else {
        // manejar caso de login fallido (por ejemplo mostrar mensaje de error)
        console.error('Login fallido', data);
      }
    } catch (error) {
      console.error('Error al iniciar sesión', error);
      // mostrar mensaje al usuario, etc.
    } finally {
      console.log('complete');
      this.mostrarLoading = false;
    }
  }
}
