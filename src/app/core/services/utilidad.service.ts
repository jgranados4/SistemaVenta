import {
  effect,
  Injectable,
  model,
  signal,
  WritableSignal,
} from '@angular/core';
import { Sesion } from '../models/sesion';

@Injectable({
  providedIn: 'root',
})
export class UtilidadService {
  mensaje = signal<string>('');
  tipos = signal<string>('');
  constructor() {
    effect(() => {});
  }

  mostrarAlert(mensaje: string, tipo: string) {
    this.mensaje.set(mensaje);
    this.tipos.set(tipo);
  }
  guardarSesionUsuario(sesion: Sesion) {
    localStorage.setItem('usuarios', JSON.stringify(sesion));
  }
  obtenerSesionUsuario() {
    const data = localStorage.getItem('usuarios');
    const usuarios = JSON.parse(data!);
    return usuarios;
  }
  eliminarSesionUsuario() {
    localStorage.removeItem('usuarios');
  }
}
