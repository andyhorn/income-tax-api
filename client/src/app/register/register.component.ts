import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { finalize } from 'rxjs';
import { VerifyEmailRoute, VerifyEmailRouteData } from '../app.routes';
import { AuthError } from '../auth/business/auth.error';
import { AuthService } from '../auth/business/auth.service';
import { BusyIndicatorComponent } from '../shared/busy-indicator/busy-indicator.component';
import { minimumDuration } from '../shared/minimum-duration/minimum-duration';
import { ToastService } from '../shared/toast/toast.service';

function mustMatchValidator(field1: string, field2: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value1 = (control as FormGroup).controls[field1].value;
    const value2 = (control as FormGroup).controls[field2].value;

    if (value1 != value2) {
      return {
        'must-match': true,
      };
    }

    return null;
  };
}

@Component({
  selector: 'app-register',
  standalone: true,
  templateUrl: './register.component.html',
  imports: [
    RouterLink,
    ReactiveFormsModule,
    CommonModule,
    BusyIndicatorComponent,
  ],
})
export class RegisterComponent {
  public readonly form = new FormGroup(
    {
      email: new FormControl<string>('', {
        validators: [Validators.required, Validators.email],
      }),
      password: new FormControl<string>('', {
        validators: [Validators.required],
      }),
      confirmPassword: new FormControl<string>('', {
        validators: [Validators.required],
      }),
    },
    {
      validators: [mustMatchValidator('password', 'confirmPassword')],
    },
  );

  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly toastService = inject(ToastService);

  public busy = false;

  public submit(): void {
    this.form.markAllAsTouched();

    if (!this.form.valid) {
      return;
    }

    const email = this.form.value['email']!;
    const password = this.form.value['password']!;
    const confirmPassword = this.form.value['confirmPassword']!;

    this.busy = true;
    this.authService
      .register({
        email,
        password,
        confirmPassword,
      })
      .pipe(
        minimumDuration(),
        finalize(() => (this.busy = false)),
      )
      .subscribe({
        next: () =>
          new VerifyEmailRoute().go(
            this.router,
            new VerifyEmailRouteData(email),
          ),
        error: (err: AuthError) => {
          console.error(err);
          this.toastService.show({
            message: 'An error occurred. Please try again.',
            type: 'danger',
          });
        },
      });
  }
}
