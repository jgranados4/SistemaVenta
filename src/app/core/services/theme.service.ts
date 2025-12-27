import { Injectable, signal, effect, computed, DOCUMENT, inject } from '@angular/core';

export type Theme = 'light' | 'dark';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private readonly _document = inject(DOCUMENT);
  private readonly themeKey = 'app-theme';

  // Inicializamos con null o light, pero la verdad la dicta el init()
  private readonly _theme = signal<Theme>('light');

  readonly theme = this._theme.asReadonly();
  readonly isDark = computed(() => this._theme() === 'dark');

  constructor() {
    // El effect se encarga de los cambios FUTUROS (cuando el usuario hace click)
    effect(() => {
      const currentTheme = this._theme();
      localStorage.setItem(this.themeKey, currentTheme);
      this.applyThemeToDom(currentTheme);
    });
  }

  /**
   * Método síncrono crítico llamado por provideAppInitializer
   * Retorna void porque es síncrono (bloquea el bootstrap lo justo y necesario)
   */
  init(): void {
    const storedTheme = this.getInitialTheme();

    // 1. Aplicar al DOM INMEDIATAMENTE (Síncrono)
    // Esto asegura que antes de que Angular pinte el primer pixel, la clase ya esté ahí.
    this.applyThemeToDom(storedTheme);

    // 2. Sincronizar el estado reactivo (esto disparará el effect, pero el DOM ya estará listo)
    this._theme.set(storedTheme);

    // 3. Activar listener del sistema
    this.listenToSystemPreference();
  }

  toggleTheme(): void {
    this._theme.update((current) => (current === 'light' ? 'dark' : 'light'));
  }

  private getInitialTheme(): Theme {
    const savedTheme = localStorage.getItem(this.themeKey) as Theme;
    if (savedTheme) return savedTheme;

    return window.matchMedia('(prefers-color-scheme: dark)').matches
      ? 'dark'
      : 'light';
  }

  private applyThemeToDom(theme: Theme): void {
    // Usamos direct access para máxima velocidad en la inicialización
    const classList = this._document.documentElement.classList;
    if (theme === 'dark') {
      classList.add('dark-theme');
    } else {
      classList.remove('dark-theme');
    }
  }

  private listenToSystemPreference(): void {
    window
      .matchMedia('(prefers-color-scheme: dark)')
      .addEventListener('change', (e) => {
        if (!localStorage.getItem(this.themeKey)) {
          this._theme.set(e.matches ? 'dark' : 'light');
        }
      });
  }
}


