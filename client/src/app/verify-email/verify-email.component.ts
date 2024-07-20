import { Component, inject } from '@angular/core';
import { AuthService } from '../auth/business/auth.service';
import { buildVerifyEmailForm, VerifyEmailFormKeys } from './verify-email-form';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-verify-email',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './verify-email.component.html',
  styleUrl: './verify-email.component.scss',
})
export class VerifyEmailComponent {
  private readonly authService = inject(AuthService);

  public readonly formKeys = VerifyEmailFormKeys;
  public readonly form = buildVerifyEmailForm();

  public submit(): void {
    this.form.markAllAsTouched();

    if (this.form.valid) {
      console.log(this.form);
    }
  }
}
