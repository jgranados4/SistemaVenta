import { ComponentType } from '@angular/cdk/overlay';
import { inject, Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig} from '@angular/material/dialog';

@Injectable({
  providedIn: 'root',
})
export class ModalService {
  private readonly dialog = inject(MatDialog);

  openModal<CT, D = unknown>(
    componentRef: ComponentType<CT>,
    config?: {
      data?: D;
      isEditing?: boolean;
      width?: string;
      disableClose?: boolean;
      panelClass?: string | string[];
    }
  ): void {
    const dialogConfig: MatDialogConfig = {
      width: config?.width ?? '500px',
      disableClose: config?.disableClose ?? false,
      panelClass: config?.panelClass,
      data: {
        data: config?.data,
        isEditing: config?.isEditing ?? false,
      },
    };
    this.dialog.open(componentRef, dialogConfig);
  }
  closeModal(): void {
    this.dialog.closeAll();
  }
}
