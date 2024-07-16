import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, shareReplay, tap, throwError } from 'rxjs';
import { ToastService } from '../shared/toast/toast.service';
import { TokenService } from './token.service';

export type RegisterParams = {
  email: string;
  password: string;
  confirmPassword: string;
};

export type LoginParams = {
  email: string;
  password: string;
};

export type AuthenticationResult = {
  access: string;
  refresh: string;
};

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly tokenService = inject(TokenService);
  private readonly toastService = inject(ToastService);
  private readonly http = inject(HttpClient);

  public register({
    email,
    password,
    confirmPassword,
  }: RegisterParams): Observable<AuthenticationResult> {
    return this.http
      .post<AuthenticationResult>('auth/sign-up', {
        email,
        password,
        confirmPassword,
      })
      .pipe(
        shareReplay(),
        catchError((err: HttpErrorResponse) => {
          if (err.error.error) {
            const { error } = err.error;

            this.toastService.show({
              message: error,
              type: 'danger',
            });
          }

          return throwError(() => new Error('Registration failed'));
        }),
        tap((result) => {
          this.tokenService.write(result.access, 'access');
          this.tokenService.write(result.refresh, 'refresh');
          this.toastService.show({
            message: 'Registered successfully!',
            type: 'success',
          });
        }),
      );
  }

  public login({
    email,
    password,
  }: LoginParams): Observable<AuthenticationResult> {
    return this.http
      .post<AuthenticationResult>('auth/login', { email, password })
      .pipe(
        shareReplay(),
        catchError((err: HttpErrorResponse) => {
          console.error(err);
          const { error } = err.error;

          if (error) {
            this.toastService.show({
              message: error,
              type: 'danger',
            });
          }

          return throwError(() => err);
        }),
        tap((result) => {
          this.tokenService.write(result.access, 'access');
          this.tokenService.write(result.refresh, 'refresh');
          this.toastService.show({
            message: 'Logged in!',
            type: 'success',
          });
        }),
      );
  }
}
