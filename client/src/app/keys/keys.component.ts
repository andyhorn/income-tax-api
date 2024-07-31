import { AsyncPipe, DatePipe, NgForOf, NgIf } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { KeysClient } from './keys.client';
import { AddKeyDialogComponent } from './dialogs/add-key-dialog.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { KeysService } from './keys.service';
import { BehaviorSubject } from 'rxjs';
import { ApiKey } from './keys.interface';

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
