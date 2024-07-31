import { AsyncPipe, NgIf } from '@angular/common';
import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BehaviorSubject } from 'rxjs';
import { ToastService } from '../../shared/toast/toast.service';
import { KeysClient } from '../keys.client';
import { KeysService } from '../keys.service';
import { AddKeyFormData, AddKeyFormKeys, buildKeyForm } from './add-key-form';

@Component({
  selector: 'add-key-dialog',
  templateUrl: './add-key-dialog.component.html',
  imports: [ReactiveFormsModule, AsyncPipe, NgIf],
  providers: [KeysService, KeysClient],
  standalone: true,
})
export class AddKeyDialogComponent {
  private readonly modal = inject(NgbActiveModal);
  private readonly service = inject(KeysService);
  private readonly toastService = inject(ToastService);
  private readonly tokenSubject = new BehaviorSubject<string | null>(null);

  private didCreate = false;

  public readonly form = buildKeyForm();
  public readonly formKeys = AddKeyFormKeys;
  public readonly token$ = this.tokenSubject.asObservable();

  @ViewChild('token')
  public token?: ElementRef<HTMLParagraphElement>;

  public static show(modal: NgbModal): Promise<boolean> {
    const ref = modal.open(AddKeyDialogComponent);

    return ref.result as Promise<boolean>;
  }

  public dismiss(): void {
    this.modal.close(this.didCreate);
  }

  public save(): void {
    this.form.markAllAsTouched();

    if (this.form.valid) {
      const data = AddKeyFormData.fromForm(this.form);

      this.service.create({ ...data }).subscribe((result) => {
        this.didCreate = true;
        this.tokenSubject.next(result.key);
      });
    }
  }

  public copy(): void {
    const token = this.tokenSubject.value;

    if (token) {
      const listener = (e: ClipboardEvent) => {
        e['clipboardData']?.setData('text/plain', token);
        e.preventDefault();
        this.toastService.show({
          message: 'Copied!',
          type: 'info',
        });
      };

      document.addEventListener('copy', listener);
      document.execCommand('copy');
      document.removeEventListener('copy', listener);
    }
  }
}
