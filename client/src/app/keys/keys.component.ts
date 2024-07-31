import { AsyncPipe, DatePipe, NgForOf, NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { KeysClient } from './keys.client';
import { ApiKey } from './keys.interface';
import { KeysService } from './keys.service';
import { AddKeyDialogComponent } from './dialogs/add-key-dialog/add-key-dialog.component';

@Component({
  selector: 'app-keys',
  standalone: true,
  imports: [AsyncPipe, NgIf, NgForOf, DatePipe],
  providers: [KeysClient, KeysService],
  templateUrl: './keys.component.html',
  styleUrl: './keys.component.scss',
})
export class KeysComponent {
  private readonly modal = inject(NgbModal);
  private readonly service = inject(KeysService);

  public readonly keys$ = this.service.keys$;

  public async addKey(): Promise<void> {
    await AddKeyDialogComponent.show(this.modal).then((didCreate) => {
      if (didCreate) {
        this.service.refresh();
      }
    });
  }
}
