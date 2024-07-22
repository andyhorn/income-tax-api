import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, shareReplay, throwError } from 'rxjs';
import { AuthError } from '../business/auth.error';
import {
  AuthLoginParameters,
  AuthRegisterParameters,
  AuthResendCodeParameters,
  AuthUserTokens,
  AuthVerifyEmailParameters,
} from './auth-data.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthClient {
  private readonly http = inject(HttpClient);

  public register(params: AuthRegisterParameters): Observable<boolean> {
    return this.executeRequest(
      this.http.post<any>('auth/sign-up', params).pipe(map(() => true)),
    );
  }

  public login(params: AuthLoginParameters): Observable<AuthUserTokens> {
    return this.executeRequest(
      this.http.post<AuthUserTokens>('auth/login', params),
    );
  }

  public refreshUserTokens(refreshToken: string): Observable<AuthUserTokens> {
    return this.executeRequest(
      this.http.post<AuthUserTokens>('auth/refresh', { token: refreshToken }),
    );
  }

  public resendEmailVerificationCode(
    params: AuthResendCodeParameters,
  ): Observable<boolean> {
    return this.executeRequest(this.http.post<any>('auth/resend', params));
  }

  public verifyEmail(
    params: AuthVerifyEmailParameters,
  ): Observable<AuthUserTokens> {
    return this.executeRequest(
      this.http.post<AuthUserTokens>('auth/verify', params),
    );
  }

  private executeRequest<T>(obs: Observable<T>): Observable<T> {
    return obs.pipe(
      shareReplay(),
      catchError((err: HttpErrorResponse) =>
        throwError(() => AuthError.fromErrorResponse(err)),
      ),
    );
  }
}
