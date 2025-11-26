import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ThemeService } from './core/services/theme.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  title = 'AngularTailwindcss';
  private themeService = inject(ThemeService);
  
  // Exponer el signal del tema para usar en el template
  readonly theme = this.themeService.theme;

  ngOnInit(): void {
    // El servicio ya se inicializa automáticamente y aplica el tema
  }
}
