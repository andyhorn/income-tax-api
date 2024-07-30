import { provideHttpClient } from '@angular/common/http';
import { computed, inject, Injectable } from '@angular/core';
import { catchError, map, Observable, of, tap, throwError } from 'rxjs';
import {
  AuthLoginParameters,
  AuthRegisterParameters,
  AuthResendCodeParameters,
  AuthUserTokens,
  AuthVerifyEmailParameters,
} from '../data/auth-data.interface';
import { AuthClient } from '../data/auth.client';
import { TokenService } from './token.service';

export abstract class AuthState {}

export class Authenticated extends AuthState {
  constructor(public readonly accessToken: string) {
    super();
  }
}

export class Unauthenticated extends AuthState {}

@Injectable({
  providedIn: 'root',
  deps: [provideHttpClient],
})
export class AuthService {
  private readonly tokenService = inject(TokenService);
  private readonly client = inject(AuthClient);

  public readonly authState = computed(() => {
    const accessToken = this.tokenService.accessToken();

    if (accessToken) {
      return new Authenticated(accessToken);
    }

    return new Unauthenticated();
  });

  public logout(): Observable<any> {
    return of(0).pipe(tap(() => this.tokenService.clear()));
  }

  public register(params: AuthRegisterParameters): Observable<boolean> {
    return this.client.register(params);
  }

  public login(params: AuthLoginParameters): Observable<AuthUserTokens> {
    return this.client
      .login(params)
      .pipe(tap((tokens) => this.tokenService.save(tokens)));
  }

  public resendVerificationCode(
    params: AuthResendCodeParameters,
  ): Observable<boolean> {
    return this.client.resendEmailVerificationCode(params);
  }

  public verifyEmail(params: AuthVerifyEmailParameters): Observable<boolean> {
    return this.client.verifyEmail(params).pipe(
      tap((tokens) => this.tokenService.save(tokens)),
      map(() => true),
    );
  }

  public attemptRefresh(): Observable<boolean> {
    const refreshToken = this.tokenService.refreshToken;

    if (!refreshToken) {
      return of(false);
    }

    return this.client.refreshUserTokens(refreshToken).pipe(
      tap((tokens) => this.tokenService.save(tokens)),
      map(() => true),
      catchError((error) => {
        this.tokenService.clear();
        return throwError(() => error);
      }),
    );
  }
}
