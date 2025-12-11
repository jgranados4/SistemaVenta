import {
  Injectable
} from '@angular/core';
import { Sesion } from '@core/interface';

@Injectable({
  providedIn: 'root',
})
export class UtilidadService {
  

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
