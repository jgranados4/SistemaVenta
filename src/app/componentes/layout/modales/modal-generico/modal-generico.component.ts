import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
@Component({
  selector: 'app-modal-generico',
  template: 
  `
        <div class="modal">
          <header>
            <h2>{{ title() }}</h2>
            <button (click)="close()">&times;</button>
          </header>
          <section class="content">
            <ng-content></ng-content>
          </section>
          <footer>
            <ng-content select="[footer]"></ng-content>
          </footer>
        </div>
      
    
  `,
  styles: `
   

    .modal {
      border-radius: 8px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 16px 24px;
      border-bottom: 1px solid #e0e0e0;
    }

    header h2 {
      margin: 0;
      font-size: 20px;
      font-weight: 500;
    }

    header button {
      background: none;
      border: none;
      font-size: 24px;
      cursor: pointer;
      padding: 0;
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 4px;
      transition: background 0.2s;
    }

    header button:hover {
      background: rgba(0, 0, 0, 0.04);
    }

    .content {
      padding: 24px;
    }

    footer {
      padding: 16px 24px;
      border-top: 1px solid #e0e0e0;
      display: flex;
      justify-content: flex-end;
      gap: 8px;
    }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ModalGenericoComponent {
private dialog=inject(MatDialog)
  title = input<string>('');
  

  close() {
    this.dialog.closeAll()
  }
}
