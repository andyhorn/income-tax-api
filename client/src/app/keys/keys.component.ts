import { AsyncPipe, DatePipe, NgForOf, NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { finalize } from 'rxjs';
import { KeyUsageRoute, KeyUsageRouteData } from '../app.routes';
import { BusyIndicatorComponent } from '../shared/busy-indicator/busy-indicator.component';
import { ToastService } from '../shared/toast/toast.service';
import { AddKeyDialogComponent } from './dialogs/add-key-dialog/add-key-dialog.component';
import { DeleteKeyDialogComponent } from './dialogs/delete-key-dialog/delete-key-dialog.component';
import { ApiKey } from './keys.interface';
import { KeysService } from './keys.service';

@Component({
  selector: 'app-keys',
  standalone: true,
  imports: [
    AsyncPipe,
    NgIf,
    NgForOf,
    DatePipe,
    BusyIndicatorComponent,
    RouterLink,
  ],
  templateUrl: './keys.component.html',
  styleUrl: './keys.component.scss',
})
export class KeysComponent {
  private readonly modal = inject(NgbModal);
  private readonly service = inject(KeysService);
  private readonly toastService = inject(ToastService);

  private busyDeleteButtons: number[] = [];

  public readonly keys$ = this.service.keys$;

  public addKey(): void {
    AddKeyDialogComponent.show(this.modal);
  }

  public onDelete(key: ApiKey): void {
    DeleteKeyDialogComponent.show(this.modal).then((confirmed) => {
      if (confirmed) {
        this.addBusyForKey(key);

        this.service
          .delete(key.id)
          .pipe(finalize(() => this.removeBusyForKey(key)))
          .subscribe(() =>
            this.toastService.show({
              message: 'Deleted!',
              type: 'primary',
            }),
          );
      }
    });
  }

  public isDeleting(key: ApiKey): boolean {
    return this.busyDeleteButtons.includes(key.id);
  }

  public routerLink(key: ApiKey): string {
    const url = new KeyUsageRoute().fullPath(new KeyUsageRouteData(key.id));
    return url;
  }

  private addBusyForKey(key: ApiKey): void {
    this.busyDeleteButtons = [...this.busyDeleteButtons, key.id];
  }

  private removeBusyForKey(key: ApiKey): void {
    this.busyDeleteButtons = this.busyDeleteButtons.filter((x) => x != key.id);
  }
}
