import { Component, signal, inject } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';
import { ThemeService } from '@core/services/theme.service';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    MatIconModule,
    MatButtonModule,
    MatTooltipModule,
  ],
  templateUrl: './layout.component.html',
  styleUrl: './layout.component.css',
})
export class LayoutComponent {
  isSidebarActive = signal<boolean>(false);
  isUsuario = signal<boolean>(false);
  private themeService = inject(ThemeService);
  
  // Exponer el tema para usar en el template
  readonly isDark = this.themeService.isDark;

  toggleSidebar() {
    this.isSidebarActive.update(active=>!active)
  }

  toggleTheme() {
    this.themeService.toggleTheme();
  }
}
