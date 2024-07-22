import { Component, inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthError } from '../auth/business/auth.error';
import { AuthService } from '../auth/business/auth.service';
import { ToastService } from '../shared/toast/toast.service';
import { buildVerifyEmailForm, VerifyEmailFormKeys } from './verify-email-form';

@Component({
  selector: 'app-verify-email',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './verify-email.component.html',
  styleUrl: './verify-email.component.scss',
})
export class VerifyEmailComponent {
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);
  private readonly toastService = inject(ToastService);

  private email?: string;

  public readonly formKeys = VerifyEmailFormKeys;
  public readonly form = buildVerifyEmailForm();

  constructor() {
    this.email = this.router.getCurrentNavigation()?.extras.state?.['email'];
  }

  public submit(): void {
    this.form.markAllAsTouched();

    if (this.form.valid) {
      console.log(this.form);
    }
  }

  public resend(): void {
    if (!this.email) {
      return;
    }

    this.authService
      .resendVerificationCode({
        email: this.email,
      })
      .subscribe({
        next: () => {
          this.toastService.show({
            message: 'PIN re-sent!',
            type: 'success',
          });
        },
        error: (err: AuthError) => {
          this.toastService.show({
            message: 'An error occurred. Please try again.',
            type: 'danger',
          });
        },
      });
  }
}
