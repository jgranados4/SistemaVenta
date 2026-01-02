import { ComponentType } from '@angular/cdk/overlay';
import { inject, Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig} from '@angular/material/dialog';

export interface ModalConfig<D = unknown> {
  data?: D;
  isEditing?: boolean;
  width?: string;
  disableClose?: boolean;
  panelClass?: string | string[];
  // Nueva propiedad para controlar la posición lateral
  sidebarPosition?: 'left' | 'right';
}

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  private readonly dialog = inject(MatDialog);

  openModal<CT, D = unknown>(
    componentRef: ComponentType<CT>,
    config?: ModalConfig<D>
  ): void {
     // Configuración base
    const dialogConfig: MatDialogConfig = {
      width: config?.width ?? (config?.sidebarPosition ? '400px' : '600px'), // Ancho por defecto diferente para sidebar
      disableClose: config?.disableClose ?? false,
      data: {
        data: config?.data,
        isEditing: config?.isEditing ?? false,
      },
      // Clases CSS base + clases dinámicas para sidebar
      panelClass: this.getPanelClasses(config),
      autoFocus: false, // Recomendado para sidebars para evitar saltos bruscos
    };

    // Lógica de Posicionamiento
    if (config?.sidebarPosition) {
      dialogConfig.height = '100vh'; // Altura completa
      dialogConfig.position = {
        top: '0px',
        [config.sidebarPosition]: '0px', // 'left': '0px' o 'right': '0px' dinámicamente
      };
      
      // Animación de entrada/salida personalizada (opcional, pero recomendada)
      dialogConfig.enterAnimationDuration = '300ms';
      dialogConfig.exitAnimationDuration = '200ms';
    }

    this.dialog.open(componentRef, dialogConfig);
  }
  closeModal(): void {
    this.dialog.closeAll();
  }
  // Helper para combinar clases
  private getPanelClasses(config?: ModalConfig<unknown>): string[] {
    const classes: string[] = [];
    
    if (config?.panelClass) {
      if (Array.isArray(config.panelClass)) {
        classes.push(...config.panelClass);
      } else {
        classes.push(config.panelClass);
      }
    }

    // Agregamos una clase global específica si es sidebar
    if (config?.sidebarPosition) {
      classes.push(`app-sidebar-dialog-${config.sidebarPosition}`);
    }

    return classes;
  }
}
