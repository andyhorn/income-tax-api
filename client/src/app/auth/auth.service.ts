import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { ToastService } from '../shared/toast/toast.service';
import { TokenService } from './token.service';

export type RegisterParams = {
  email: string;
  password: string;
  confirmPassword: string;
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
        }),
      );
  }
}
