import { ChangeDetectionStrategy, Component, inject, input } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-modal-generico',
  standalone: true,
  imports: [MatButtonModule, MatIconModule],
  template: `
    <div class="modal-layout">
      <!-- Header con Grid para centrado perfecto -->
      <header class="modal-header">
        <!-- Elemento fantasma para equilibrar el grid -->
        <div class="header-spacer"></div>
        
        <h2 class="mat-title-medium">{{ title() }}</h2>
        
        <button mat-icon-button (click)="close()" type="button">
          <mat-icon>close</mat-icon>
        </button>
      </header>

      <!-- Contenido Scrolleable -->
      <section class="modal-content scroll-container">
        <ng-content></ng-content>
      </section>

      <!-- Footer Fijo -->
      <footer class="modal-footer">
        <ng-content select="[footer]"></ng-content>
      </footer>
    </div>
  `,
  styles: [`
    :host {
      display: block;
      height: 100%;
    }

    .modal-layout {
      display: flex;
      flex-direction: column;
      height: 100%;
    }

    .modal-header {
      display: grid;
      /* 3 columnas: botón fantasma (48px) - espacio flexible - botón real (48px) */
      grid-template-columns: 48px 1fr 48px;
      align-items: center;
      padding: 16px 24px;
      border-bottom: 1px solid var(--mat-sys-outline-variant, #e0e0e0);
      flex-shrink: 0;
    }

    .modal-header h2 {
      margin: 0;
      color: var(--mat-sys-on-surface);
      text-align: center; /* Centramos el texto en su celda */
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    /* El spacer ocupa el mismo espacio que el botón para equilibrar */
    .header-spacer {
      width: 48px; 
    }

    .modal-content {
      padding: 24px;
      flex-grow: 1;
      overflow-y: auto;
    }

    .modal-footer {
      padding: 16px 24px;
      border-top: 1px solid var(--mat-sys-outline-variant, #e0e0e0);
      background-color: var(--mat-sys-surface);
      flex-shrink: 0;
    }
  `],
  
})
export class ModalGenericoComponent {
  private readonly dialogRef = inject(MatDialogRef);
  
  title = input.required<string>();

  close() {
    this.dialogRef.close();
  }
}