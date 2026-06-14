import { Component, signal, inject, ChangeDetectionStrategy } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { ThemeService } from '@core/services/theme.service';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AppTopbar } from './app-topbar/app-topbar';
interface MenuItem {
  label: string;
  icon: string;
  link: string;
}

@Component({
  selector: 'app-layout',
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
    AppTopbar
  ],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LayoutComponent {
  isSidebarActive = signal<boolean>(false);
  isCollapsed = signal(false);
  isUsuario = signal<boolean>(false);
  private themeService = inject(ThemeService);
  // Exponer el tema para usar en el template
  readonly isDark = this.themeService.isDark;
  readonly menuItems = signal<MenuItem[]>([
    { label: 'Dashboard',       icon: 'dashboard',       link: '/pages/dashboard' },
    { label: 'Usuarios',        icon: 'group',           link: '/pages/usuarios' },
    { label: 'Productos',       icon: 'inventory_2',     link: '/pages/productos' },
    { label: 'Venta',           icon: 'point_of_sale',   link: '/pages/Venta' },
    { label: 'Historial Venta', icon: 'receipt_long',    link: '/pages/historial_venta' },
    { label: 'Reportes',        icon: 'analytics',       link: '/pages/reportes' },
  ]);

  toggleSidebar() {
    this.isSidebarActive.update((active) => !active);
  }
  toggleCollapse() {
    this.isCollapsed.update(val => !val);
  }

  toggleTheme() {
    this.themeService.toggleTheme();
  }
}
