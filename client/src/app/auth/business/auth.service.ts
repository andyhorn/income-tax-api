import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, filter, map, Observable, of, tap } from 'rxjs';
import {
  AuthLoginParameters,
  AuthRegisterParameters,
  AuthResendCodeParameters,
  AuthUserTokens,
  AuthVerifyEmailParameters,
} from '../data/auth-data.interface';
import { AuthClient } from '../data/auth.client';
import { AuthError } from './auth.error';
import { RefreshTokenService } from './token.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly tokenService = inject(RefreshTokenService);
  private readonly client = inject(AuthClient);
  private readonly accessTokenSubject = new BehaviorSubject<
    string | null | undefined
  >(undefined);

  public readonly accessToken$: Observable<string | null> =
    this.accessTokenSubject.asObservable().pipe(
      filter((token) => token !== undefined),
      map((token) => token as string | null),
    );

  constructor() {
    const refresh = this.tokenService.get();

    if (refresh) {
      this.client.refreshUserTokens(refresh).subscribe({
        next: (tokens) => {
          this.tokenService.save(tokens.refresh);
          this.accessTokenSubject.next(tokens.access);
        },
        error: (err: AuthError) => {
          this.tokenService.remove();
          this.accessTokenSubject.next(null);
        },
      });
    } else {
      this.accessTokenSubject.next(null);
    }
  }

  public logout(): Observable<any> {
    return of(0).pipe(
      tap(() => {
        this.tokenService.remove();
        this.accessTokenSubject.next(null);
      }),
    );
  }

  public register(params: AuthRegisterParameters): Observable<boolean> {
    return this.client.register(params);
  }

  public login(params: AuthLoginParameters): Observable<AuthUserTokens> {
    return this.client.login(params).pipe(
      tap((tokens) => this.tokenService.save(tokens.refresh)),
      tap((tokens) => this.accessTokenSubject.next(tokens.access)),
    );
  }

  public resendVerificationCode(
    params: AuthResendCodeParameters,
  ): Observable<boolean> {
    return this.client.resendEmailVerificationCode(params);
  }

  public verifyEmail(params: AuthVerifyEmailParameters): Observable<boolean> {
    return this.client.verifyEmail(params).pipe(
      tap((tokens) => this.tokenService.save(tokens.refresh)),
      tap((tokens) => this.accessTokenSubject.next(tokens.access)),
      map(() => true),
    );
  }
}
