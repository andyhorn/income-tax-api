import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, shareReplay, throwError } from 'rxjs';
import { AuthError } from '../business/auth.error';
import {
  AuthLoginParameters,
  AuthRegisterParameters,
  AuthUserTokens,
} from './auth-data.interface';

@Injectable({
  providedIn: 'root',
})
export class AuthClient {
  private readonly http = inject(HttpClient);

  public register(params: AuthRegisterParameters): Observable<AuthUserTokens> {
    return this.http.post<AuthUserTokens>('auth/sign-up', params).pipe(
      shareReplay(),
      catchError((err: HttpErrorResponse) =>
        throwError(() => AuthError.fromErrorResponse(err)),
      ),
    );
  }

  public login(params: AuthLoginParameters): Observable<AuthUserTokens> {
    return this.http.post<AuthUserTokens>('auth/login', params).pipe(
      shareReplay(),
      catchError((err: HttpErrorResponse) =>
        throwError(() => AuthError.fromErrorResponse(err)),
      ),
    );
  }

  public refresh(token: string): Observable<AuthUserTokens> {
    return this.http.post<AuthUserTokens>('auth/refresh', { token }).pipe(
      shareReplay(),
      catchError((err: HttpErrorResponse) =>
        throwError(() => AuthError.fromErrorResponse(err)),
      ),
    );
  }
}
