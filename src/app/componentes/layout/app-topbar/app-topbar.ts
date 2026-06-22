import {  Component, inject, output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { ThemeService } from '@core/services';

@Component({
  selector: 'app-topbar',
  imports: [MatIconModule,MatButtonModule],
  templateUrl: './app-topbar.html',
  styleUrl: './app-topbar.css',
  
})
export class AppTopbar {
   private themeService = inject(ThemeService);
  // Exponer el tema para usar en el template
  readonly isDark = this.themeService.isDark;
  toggleTheme = output();
  toggleSidebar = output();

}
