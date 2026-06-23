import { Component, computed, effect, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { UtilidadService } from '@core/services/utilidad.service';
import { AuthService } from '@core/services/auth.service';
import {
  ApxFormulario,
  FieldConfig,
} from '@jgranados199795/apx-ui/apx-formulario';
import { firstValueFrom, take, timer } from 'rxjs';
import { Empresa } from '@core/interface/registroEmpresa';
import { showAlert } from '@shared/utility';
import { PlanesService } from '@core/services/planes.service';

interface Plan {
  idPlan: number;
  nombre: string;
  precio: string;
  limiteUsuarios: number;
}

@Component({
  selector: 'app-registro-empresa',
  standalone: true,
  imports: [ApxFormulario, RouterLink],
  templateUrl: './registro-empresa.html',
})
export class RegistroEmpresaComponent {
  private planes = inject(PlanesService).listar;

  readonly #planOptions = computed(
    () =>
      this.planes.value()?.value.map((plan: Plan) => ({
        value: plan.idPlan,
        label: plan.nombre,
      })) ?? [],
  );

  constructor() {
    effect(() => {
      console.log(`plannes Elegido ${JSON.stringify(this.fields())}`);
    });
  }
  // Los campos que tu Backend necesita para crear Empresa + Usuario Admin
  fields = computed<FieldConfig[]>(() => [
    {
      key: 'nombreEmpresa',
      type: 'text',
      label: 'Nombre de la Empresa o Negocio',
      placeholder: 'Ej: Comercializadora SA',
      required: true,
      fieldSize: 'full',
      validators: [{ name: 'required' }],
    },
    {
      key: 'nombreDueño',
      type: 'text',
      label: 'Tu Nombre y Apellido (Administrador)',
      placeholder: 'Juan Pérez',
      required: true,
      fieldSize: 'full',
      validators: [{ name: 'required' }],
    },
    {
      key: 'numeroDocumento',
      type: 'text',
      label: 'Numero de Documento',
      placeholder: '',
      required: true,
      fieldSize: 'full',
      validators: [{ name: 'required' }],
    },
    {
      key: 'telefonoEmpresa',
      type: 'text',
      label: 'Teléfono',
      placeholder: '+593 99 000 0000',
      required: true,
      fieldSize: 'full',
      validators: [{ name: 'required' }],
    },
    {
      key: 'correoDueño',
      type: 'email',
      label: 'Correo Electrónico',
      placeholder: 'admin@empresa.com',
      required: true,
      fieldSize: 'full',
      validators: [{ name: 'required' }, { name: 'email' }],
    },
    {
      key: 'idPlanElegido',
      type: 'select',
      label: 'Plan',
      // ✅ Ahora sí: array de { value, label } mapeado desde la API
      options: this.#planOptions(),
    },
    {
      key: 'claveDueño',
      type: 'password',
      label: 'Contraseña del Sistema',
      placeholder: '••••••••',
      required: true,
      fieldSize: 'full',
      validators: [{ name: 'required' }],
    },
  ]);

  router = inject(Router);
  private authService = inject(AuthService);
  private utilidadService = inject(UtilidadService);

  mostrarLoading = signal<boolean>(false);

  async onSubmit(formData: Record<string, unknown>) {
    this.mostrarLoading.set(true);

    try {
      // Llamada a tu endpoint público /api/Auth/RegistrarNegocio
      const data = await firstValueFrom(
        this.authService.registrarNegocio(formData as Partial<Empresa>),
      );

      if (data.status) {
        showAlert(
          'Empresa registrada con éxito. ¡Inicia sesión!',
          'Éxito',
          'success',
        );
        timer(1000)
          .pipe(take(1))
          .subscribe(() => {
            this.router.navigate(['/login']);
          });
      } else {
        showAlert(
          data.msg || 'No se pudo registrar la empresa',
          'Error',
          'error',
        );
      }
    } catch (error) {
      console.error('Error al registrar', error);
      showAlert('Error de conexión con el servidor', 'Error', 'error');
    } finally {
      this.mostrarLoading.set(false);
    }
  }
}
