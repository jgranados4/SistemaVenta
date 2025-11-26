import { Injectable, signal, effect } from '@angular/core';

export type Theme = 'light' | 'dark';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  // Signal para el tema actual
  private readonly themeKey = 'app-theme';
  private readonly _theme = signal<Theme>(this.getInitialTheme());
  
  // Signal público de solo lectura
  readonly theme = this._theme.asReadonly();

  constructor() {
    // Efecto para aplicar el tema cuando cambie
    effect(() => {
      const currentTheme = this._theme();
      this.applyTheme(currentTheme);
      this.saveTheme(currentTheme);
    });

    // Aplicar tema inicial
    this.applyTheme(this._theme());
  }

  /**
   * Obtiene el tema inicial desde localStorage o preferencia del sistema
   */
  private getInitialTheme(): Theme {
    const savedTheme = localStorage.getItem(this.themeKey) as Theme;
    if (savedTheme) {
      return savedTheme;
    }
    
    // Verificar preferencia del sistema
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    
    return 'light';
  }

  /**
   * Cambia el tema entre claro y oscuro
   */
  toggleTheme(): void {
    const newTheme: Theme = this._theme() === 'light' ? 'dark' : 'light';
    this._theme.set(newTheme);
  }

  /**
   * Establece un tema específico
   */
  setTheme(theme: Theme): void {
    this._theme.set(theme);
  }

  /**
   * Aplica el tema al documento
   */
  private applyTheme(theme: Theme): void {
    const body = document.body;
    const html = document.documentElement;
    
    if (theme === 'dark') {
      body.classList.add('dark-theme');
      html.classList.add('dark-theme');
    } else {
      body.classList.remove('dark-theme');
      html.classList.remove('dark-theme');
    }
  }

  /**
   * Guarda el tema en localStorage
   */
  private saveTheme(theme: Theme): void {
    localStorage.setItem(this.themeKey, theme);
  }

  /**
   * Verifica si el tema actual es oscuro
   */
  isDarkMode(): boolean {
    return this._theme() === 'dark';
  }
}


