import { AsyncPipe, NgClass, NgFor, NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { NgbToastModule } from '@ng-bootstrap/ng-bootstrap';
import { Toast, ToastService } from './toast.service';

@Component({
  selector: 'app-toasts',
  templateUrl: './toast.component.html',
  standalone: true,
  styles: [
    `
      :host {
        position: fixed;
        top: 0;
        right: 0;
        margin: 0.5rem;
        z-index: 1000;
      }
    `,
  ],
  imports: [AsyncPipe, NgFor, NgIf, NgClass, NgbToastModule],
})
export class ToastComponent {
  private readonly toastService = inject(ToastService);

  public readonly toasts$ = this.toastService.toasts$;

  public remove(toast: Toast): void {
    this.toastService.remove(toast);
  }
}
