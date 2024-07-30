import { NgIf } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { finalize, of, switchMap, tap } from 'rxjs';
import {
  HomeRoute,
  LoginRouteData,
  VerifyEmailRoute,
  VerifyEmailRouteData,
} from '../app.routes';
import {
  AuthError,
  EmailNotConfirmedError,
  InvalidCredentialsError,
} from '../auth/business/auth.error';
import { AuthService } from '../auth/business/auth.service';
import { BusyIndicatorComponent } from '../shared/busy-indicator/busy-indicator.component';
import { minimumDuration } from '../shared/minimum-duration/minimum-duration';
import { ToastService } from '../shared/toast/toast.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, NgIf, BusyIndicatorComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  public readonly form = new FormGroup({
    email: new FormControl<string>('', {
      validators: [Validators.required, Validators.email],
    }),
    password: new FormControl<string>('', {
      validators: [Validators.required],
    }),
  });

  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly toastService = inject(ToastService);
  private readonly route = inject(ActivatedRoute);

  public busy = false;

  public ngOnInit(): void {
    of(0)
      .pipe(
        tap(() => (this.busy = true)),
        minimumDuration(),
        switchMap(() => this.authService.attemptRefresh()),
        finalize(() => (this.busy = false)),
      )
      .subscribe({
        next: (success) => {
          if (success) {
            const data = LoginRouteData.fromRoute(this.route.snapshot);

            if (data.redirect) {
              this.router.navigateByUrl(data.redirect);
            } else {
              new HomeRoute().go(this.router);
            }
          }

          this.toastService.show({
            message: 'Logged in',
            type: 'success',
          });
        },
        error: (error) => {
          console.error(error);
          this.toastService.show({
            message: 'Oops! Something went wrong. Please log back in.',
            type: 'danger',
          });
        },
      });
  }

  public login(): void {
    this.form.markAllAsTouched();

    if (!this.form.valid) {
      return;
    }

    const email = this.form.get('email')!.value!;
    const password = this.form.get('password')!.value!;

    this.busy = true;
    this.authService
      .login({ email, password })
      .pipe(
        minimumDuration(),
        finalize(() => (this.busy = false)),
      )
      .subscribe({
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
