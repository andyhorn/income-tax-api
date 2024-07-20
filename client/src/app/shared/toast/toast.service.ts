import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type ToastType = 'info' | 'success' | 'danger';

export type Toast = {
  message: string;
  type: ToastType;
};

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private readonly toastsSubject = new BehaviorSubject<Toast[]>([]);

  public readonly toasts$ = this.toastsSubject.asObservable();

  public show(toast: Toast): void {
    this.toastsSubject.next([...this.toastsSubject.getValue(), toast]);
  }

  public remove(toast: Toast): void {
    this.toastsSubject.next([
      ...this.toastsSubject.getValue().filter((t) => t != toast),
    ]);
  }
}
