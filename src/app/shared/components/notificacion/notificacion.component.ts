import { Component, inject, signal } from '@angular/core';
import { UtilidadService } from '@core/services/utilidad.service';

@Component({
  selector: 'app-notificacion',
  standalone: true,
  imports: [],
  templateUrl: './notificacion.component.html',
  styleUrl: './notificacion.component.css',
})
export class NotificacionComponent {
  private utilidad = inject(UtilidadService);
  mensaje = this.utilidad.mensaje;
  tipos = this.utilidad.tipos;
}
