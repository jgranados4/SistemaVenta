import { Component, signal, inject, effect, computed } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { ThemeService } from '@core/services/theme.service';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AppTopbar } from './app-topbar/app-topbar';
import { MenuService, UtilidadService } from '@core/services';
interface MenuItem {
  label: string;
  icon: string;
  link: string;
}
interface item{

idMenu:number,
nombre: string,
icono: string,
url: string
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
    AppTopbar,
  ],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css',
})
export class LayoutComponent {
  isSidebarActive = signal<boolean>(false);
  isCollapsed = signal(false);
  isUsuario = signal<boolean>(false);
  private themeService = inject(ThemeService);
  protected readonly  usuario=inject(UtilidadService);
  private Menu = inject(MenuService).listar;
  constructor() {
    effect(() => {
      console.log(
        'Menu',
        this.Menu.value()?.value,
        'boolean',
        this.Menu.hasValue(),
      );
    });
  }
  // Exponer el tema para usar en el template
  readonly isDark = this.themeService.isDark;
  readonly menuItems = computed<MenuItem[]>(
    () =>
      this.Menu.value()?.value.map((item: item) => ({
        label: item.nombre,
        icon: item.icono ?? 'circle', // fallback si la API no trae icono
        link: item.url ?? '#',
      })) ?? [], // fallback mientras carga
  );

  toggleSidebar() {
    this.isSidebarActive.update((active) => !active);
  }
  toggleCollapse() {
    this.isCollapsed.update((val) => !val);
  }

  toggleTheme() {
    this.themeService.toggleTheme();
  }
}
