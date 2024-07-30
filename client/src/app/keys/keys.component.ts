import { AsyncPipe, DatePipe, NgForOf, NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { KeysClient } from './keys.client';
import { AddKeyDialogComponent } from './dialogs/add-key-dialog.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { KeysService } from './keys.service';

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
    const data = await AddKeyDialogComponent.show(this.modal);
    this.service.create({ nickname: data?.nickname }).subscribe();
  }
}
