import { AsyncPipe, NgIf } from '@angular/common';
import { Component, inject, ViewChild } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import {
  NgbActiveModal,
  NgbModal,
  NgbPopover,
  NgbPopoverModule,
} from '@ng-bootstrap/ng-bootstrap';
import { BehaviorSubject, finalize } from 'rxjs';
import { BusyIndicatorComponent } from '../../../shared/busy-indicator/busy-indicator.component';
import { KeysService } from '../../keys.service';
import { AddKeyFormData, AddKeyFormKeys, buildKeyForm } from './add-key-form';

@Component({
  selector: 'add-key-dialog',
  templateUrl: './add-key-dialog.component.html',
  imports: [
    ReactiveFormsModule,
    AsyncPipe,
    NgIf,
    NgbPopoverModule,
    BusyIndicatorComponent,
  ],
  standalone: true,
})
export class AddKeyDialogComponent {
  private readonly modal = inject(NgbActiveModal);
  private readonly service = inject(KeysService);
  private readonly tokenSubject = new BehaviorSubject<string | null>(null);

  public readonly form = buildKeyForm();
  public readonly formKeys = AddKeyFormKeys;
  public readonly token$ = this.tokenSubject.asObservable();

  public busy = false;

  @ViewChild(NgbPopover)
  private readonly copiedPopover!: NgbPopover;

  public static show(modal: NgbModal): void {
    modal.open(AddKeyDialogComponent);
  }

  public dismiss(): void {
    this.modal.close();
  }

  public save(): void {
    this.form.markAllAsTouched();

    if (this.form.valid) {
      const data = AddKeyFormData.fromForm(this.form);

      this.busy = true;
      this.service
        .create({ ...data })
        .pipe(finalize(() => (this.busy = false)))
        .subscribe(({ token }) => {
          this.tokenSubject.next(token);
        });
    }
  }

  public copy(): void {
    const token = this.tokenSubject.value;

    if (token) {
      navigator.clipboard.writeText(token).then(() => {
        this.copiedPopover.open();

        setTimeout(() => this.copiedPopover.close(), 1000);
      });
    }
  }
}
