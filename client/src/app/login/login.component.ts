import { NgIf } from '@angular/common';
import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import {
  AuthError,
  EmailNotConfirmedError,
  InvalidCredentialsError,
} from '../auth/business/auth.error';
import { AuthService } from '../auth/business/auth.service';
import { ToastService } from '../shared/toast/toast.service';
import {
  HomeRoute,
  VerifyEmailRoute,
  VerifyEmailRouteData,
} from '../app.routes';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, NgIf],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  public readonly form = new FormGroup({
    email: new FormControl<string>('', {
      validators: [Validators.required, Validators.email],
    }),
    password: new FormControl<string>('', {
      validators: [Validators.required],
    }),
  });

  @ViewChild('email')
  private readonly email!: ElementRef;

  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly toastService = inject(ToastService);

  public login(): void {
    this.form.markAllAsTouched();

    if (!this.form.valid) {
      return;
    }

    const email = this.form.get('email')!.value!;
    const password = this.form.get('password')!.value!;

    this.authService.login({ email, password }).subscribe({
      error: (err: AuthError) => {
        if (err instanceof EmailNotConfirmedError) {
          new VerifyEmailRoute().go(
            this.router,
            new VerifyEmailRouteData(email),
          );

          return;
        }

        if (err instanceof InvalidCredentialsError) {
          this.form.setErrors({
            'invalid-credentials': true,
          });

          return;
        }
      },
      complete: () => {
        new HomeRoute().go(this.router);
        this.toastService.show({
          message: 'Logged in',
          type: 'success',
        });
      },
    });
  }
}
