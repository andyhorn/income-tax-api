import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, shareReplay, throwError } from 'rxjs';
import { AuthError } from '../business/auth.error';
import {
  AuthLoginParameters,
  AuthRegisterParameters,
  AuthResendCodeParameters,
  AuthUserTokens,
} from './auth-data.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthClient {
  private readonly http = inject(HttpClient);

  public register(params: AuthRegisterParameters): Observable<AuthUserTokens> {
    return this.executeRequest(
      this.http.post<AuthUserTokens>('auth/sign-up', params),
    );
  }

  public login(params: AuthLoginParameters): Observable<AuthUserTokens> {
    return this.executeRequest(
      this.http.post<AuthUserTokens>('auth/login', params),
    );
  }

  public refresh(token: string): Observable<AuthUserTokens> {
    return this.executeRequest(
      this.http.post<AuthUserTokens>('auth/refresh', { token }),
    );
  }

  public resend(params: AuthResendCodeParameters): Observable<boolean> {
    return this.executeRequest(this.http.put<any>('auth/resend', params));
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
