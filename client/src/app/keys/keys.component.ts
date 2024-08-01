import { AsyncPipe, DatePipe, NgForOf, NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastService } from '../shared/toast/toast.service';
import { AddKeyDialogComponent } from './dialogs/add-key-dialog/add-key-dialog.component';
import { DeleteKeyDialogComponent } from './dialogs/delete-key-dialog/delete-key-dialog.component';
import { ApiKey } from './keys.interface';
import { KeysService } from './keys.service';

@Component({
  selector: 'app-keys',
  standalone: true,
  imports: [AsyncPipe, NgIf, NgForOf, DatePipe],
  templateUrl: './keys.component.html',
  styleUrl: './keys.component.scss',
})
export class KeysComponent {
  private readonly modal = inject(NgbModal);
  private readonly service = inject(KeysService);
  private readonly toastService = inject(ToastService);

  public readonly keys$ = this.service.keys$;

  public addKey(): void {
    AddKeyDialogComponent.show(this.modal);
  }

  public onDelete(key: ApiKey): void {
    DeleteKeyDialogComponent.show(this.modal).then((confirmed) => {
      if (confirmed) {
        this.service.delete(key.id).subscribe(() =>
          this.toastService.show({
            message: 'Deleted!',
            type: 'info',
          }),
        );
      }
    });
  }
}
