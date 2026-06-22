import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { MaterialModule } from '@jgranados199795/apx-ui/apx-material';

@Component({
  selector: 'app-input-error',
  imports: [MaterialModule],
  template: `
    @if (errorMessage()) {
    <mat-error>{{ errorMessage() }}</mat-error>
    }
  `,
  styles: ``,
  
})
export class InputError {
  control = input.required<AbstractControl | null>();
  label = input<string>('Campo');
  errorMessage = computed(() => {
    const ctrl = this.control();

    // Si no hay control, o no se ha tocado/ensuciado, o es válido, no mostramos nada
    if (!ctrl || !ctrl.errors || (!ctrl.touched && !ctrl.dirty)) {
      return null;
    }

    const errors = ctrl.errors;

    // 4. Lógica centralizada de mensajes
    if (errors['required']) {
      return `El ${this.label().toLowerCase()} es requerido.`;
    }

    if (errors['minlength']) {
      const requiredLength = errors['minlength'].requiredLength;
      return `El ${this.label().toLowerCase()} debe tener al menos ${requiredLength} caracteres.`;
    }
     if (errors['min']) {
       return `El valor mínimo es ${errors['min'].min}.`;
     }
    if (errors['email']) {
      return 'El formato del correo es inválido.';
    }

    if (errors['pattern']) {
      return 'El formato no es válido.';
    }
     if (errors['invalidSelection']) {
       return 'Seleccione una opción de la lista.';
     }

    return 'Valor inválido.';
  });
}
