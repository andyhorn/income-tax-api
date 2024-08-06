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
  KeysListRoute,
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

enum LoginFormKeys {
  EMAIL = 'EMAIL',
  PASSWORD = 'PASSWORD',
}

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, NgIf, BusyIndicatorComponent],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit {
  public readonly formKeys = LoginFormKeys;
  public readonly form = new FormGroup({
    [LoginFormKeys.EMAIL]: new FormControl<string>('', {
      validators: [Validators.required, Validators.email],
    }),
    [LoginFormKeys.PASSWORD]: new FormControl<string>('', {
      validators: [Validators.required],
    }),
  });

  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly toastService = inject(ToastService);
  private readonly route = inject(ActivatedRoute);

  private _busy = false;
  public get busy(): boolean {
    return this._busy;
  }

  protected set busy(value: boolean) {
    this._busy = value;

    if (this._busy) {
      Object.values(LoginFormKeys).forEach((key) =>
        this.form.controls[key]?.disable(),
      );
    } else {
      Object.values(LoginFormKeys).forEach((key) =>
        this.form.controls[key]?.enable(),
      );
    }
  }

  public ngOnInit(): void {
    if (!this.authService.canRefresh()) {
      return;
    }

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
              new KeysListRoute().go(this.router);
            }

            this.toastService.show({
              message: 'Logged in',
              type: 'success',
            });
          }
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

    const email = this.form.value[LoginFormKeys.EMAIL]!;
    const password = this.form.value[LoginFormKeys.PASSWORD]!;

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
          new KeysListRoute().go(this.router);
          this.toastService.show({
            message: 'Logged in',
            type: 'success',
          });
        },
      });
  }
}
