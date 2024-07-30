import { Component, inject } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AddKeyFormData, AddKeyFormKeys, buildKeyForm } from './add-key-form';
import { ReactiveFormsModule } from '@angular/forms';

export interface AddKeyDialogData {
  nickname?: string;
}

@Component({
  selector: 'add-key-dialog',
  templateUrl: './add-key-dialog.component.html',
  imports: [ReactiveFormsModule],
  standalone: true,
})
export class AddKeyDialogComponent {
  private readonly modal = inject(NgbActiveModal);

  public readonly form = buildKeyForm();
  public readonly formKeys = AddKeyFormKeys;

  public static show(modal: NgbModal): Promise<AddKeyDialogData | undefined> {
    const ref = modal.open(AddKeyDialogComponent);

    return ref.result as Promise<AddKeyDialogData | undefined>;
  }

  public dismiss(): void {
    this.modal.close();
  }

  public save(): void {
    this.form.markAllAsTouched();

    if (this.form.valid) {
      const data = AddKeyFormData.fromForm(this.form);

      this.modal.close({
        nickname: data.nickname,
      } satisfies AddKeyDialogData);
    }
  }
}
