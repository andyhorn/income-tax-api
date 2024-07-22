import { NgForOf, NgIf } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { FormArray, FormControl, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { bootstrapXCircle } from '@ng-icons/bootstrap-icons';
import { NgIconComponent, provideIcons } from '@ng-icons/core';
import { delayWhen, finalize, timer } from 'rxjs';
import { HomeRoute } from '../app.routes';
import { AuthError } from '../auth/business/auth.error';
import { AuthService } from '../auth/business/auth.service';
import { BusyIndicatorComponent } from '../shared/busy-indicator/busy-indicator.component';
import { ToastService } from '../shared/toast/toast.service';
import {
  buildVerifyEmailForm,
  VerifyEmailFormData,
  VerifyEmailFormKeys,
} from './verify-email-form';
import { minimumDuration } from '../shared/minimum-duration/minimum-duration';

export const PIN_LENGTH = 6;

@Component({
  selector: 'app-verify-email',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgIf,
    NgForOf,
    NgIconComponent,
    BusyIndicatorComponent,
  ],
  providers: [provideIcons({ bootstrapXCircle })],
  templateUrl: './verify-email.component.html',
  styleUrl: './verify-email.component.scss',
})
export class VerifyEmailComponent implements AfterViewInit {
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);
  private readonly toastService = inject(ToastService);

  private email?: string;

  public readonly formKeys = VerifyEmailFormKeys;
  public readonly form = buildVerifyEmailForm(PIN_LENGTH);

  public busy = false;

  @ViewChildren('digit')
  private readonly inputs!: QueryList<ElementRef<HTMLInputElement>>;

  public get digits(): FormArray<FormControl<string>> {
    const array = this.form.get(VerifyEmailFormKeys.PIN);
    return array as FormArray;
  }

  constructor() {
    this.email = this.router.getCurrentNavigation()?.extras.state?.['email'];
  }

  public ngAfterViewInit(): void {
    this.focusDigit(0);
  }

  public onChanged(control: FormControl<string>, index: number): void {
    if (control.value && index < PIN_LENGTH) {
      this.focusDigit(index + 1);
    }
  }

  public onPaste(event: ClipboardEvent, index: number): void {
    event.stopPropagation();
    const data = event.clipboardData?.getData('text/plain');

    if (data) {
      const pastedDigits = data.split('');

      if (pastedDigits.length != PIN_LENGTH) {
        this.toastService.show({
          message: 'Invalid PIN Length',
          type: 'info',
        });

        return;
      }

      this.digits.patchValue(pastedDigits);
      this.focusDigit(PIN_LENGTH - 1);
    }
  }

  public submit(): void {
    this.form.markAllAsTouched();

    if (this.form.valid) {
      const data = VerifyEmailFormData.fromFormGroup(this.form);
      this.busy = true;

      this.authService
        .verifyEmail({
          email: this.email!,
          token: data.pin,
        })
        .pipe(
          minimumDuration(),
          finalize(() => (this.busy = false)),
        )
        .subscribe({
          next: () => {
            this.toastService.show({
              message: 'Email verified!',
              type: 'success',
            });
            new HomeRoute().go(this.router);
          },
          error: () => {
            this.toastService.show({
              message: 'An error occurred. Please try again.',
              type: 'danger',
            });
          },
        });
    }
  }

  public resend(): void {
    if (!this.email) {
      return;
    }

    this.busy = true;
    const now = Date.now();

    this.authService
      .resendVerificationCode({
        email: this.email,
      })
      .pipe(
        minimumDuration(),
        finalize(() => (this.busy = false)),
      )
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

  private focusDigit(index: number): void {
    this.inputs?.get(index)?.nativeElement.focus();
  }
}
