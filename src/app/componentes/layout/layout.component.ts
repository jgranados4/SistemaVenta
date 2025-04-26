import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { DesplegarBotonDirective } from '@core/directives/desplegarBoton.directive';
@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, CommonModule, DesplegarBotonDirective],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css',
})
export class LayoutComponent {
  isSidebarActive = signal<boolean>(false);
  isUsuario = signal<boolean>(false);
  toggleSidebar() {
    this.isSidebarActive.set(!this.isSidebarActive());
  }
}
