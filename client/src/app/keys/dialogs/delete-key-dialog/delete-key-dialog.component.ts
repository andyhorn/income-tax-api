import { Component, inject } from '@angular/core';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'delete-key-dialog',
  standalone: true,
  template: `
    <div class="modal-header">
      <h5 class="m-0">Delete Key</h5>
    </div>
    <div class="modal-body">
      <p>Are you sure you want to permanently delete this key?</p>
      <p>This cannot be undone.</p>
    </div>
    <div class="modal-footer">
      <button class="btn btn-secondary" (click)="modal.close(false)">
        Cancel
      </button>
      <button class="btn btn-danger" (click)="modal.close(true)">
        Confirm
      </button>
    </div>
  `,
})
export class DeleteKeyDialogComponent {
  public readonly modal = inject(NgbActiveModal);

  public static show(modal: NgbModal): Promise<boolean | undefined> {
    const ref = modal.open(DeleteKeyDialogComponent);

    return ref.result;
  }
}
