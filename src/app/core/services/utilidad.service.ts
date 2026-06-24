import {
  computed,
  Injectable,
  signal
} from '@angular/core';
import { Sesion } from '@core/interface';


export interface SesionUsuario {
  correo: string;
  idEmpresa: number;
  idUsuario: number;
  nombreCompleto: string;
  rolDescripcion: string;
}

@Injectable({
  providedIn: 'root',
})
export class UtilidadService {
  readonly #sesion = signal<SesionUsuario | null>(this.#cargarSesion());

  // ✅ computed() para derivar idEmpresa — reactivo automáticamente
  readonly idEmpresa = computed(() => this.#sesion()?.idEmpresa ?? null);
  readonly usuario = computed(() => this.#sesion());
  readonly isLoggedIn = computed(() => this.#sesion() !== null);

  guardarSesionUsuario(sesion: Sesion) {
    localStorage.setItem('usuarios', JSON.stringify(sesion));
    this.#sesion.set(sesion);
  }
  #cargarSesion(): SesionUsuario | null {
    const data = localStorage.getItem('usuarios');
    if (!data) return null;
    return JSON.parse(data) as SesionUsuario;
  }
  eliminarSesionUsuario() {
    localStorage.removeItem('usuarios');
    this.#sesion.set(null);
  }
}
