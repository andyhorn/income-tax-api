import { inject, Injectable } from '@angular/core';
import {
  BehaviorSubject,
  combineLatest,
  filter,
  finalize,
  map,
  Observable,
  of,
  shareReplay,
  startWith,
  tap,
} from 'rxjs';
import {
  AuthLoginParameters,
  AuthRegisterParameters,
  AuthResendCodeParameters,
  AuthUserTokens,
  AuthVerifyEmailParameters,
} from '../data/auth-data.interface';
import { AuthClient } from '../data/auth.client';
import { AuthError } from './auth.error';
import { TokenService } from './token.service';

export abstract class AuthState {}

export class Unknown extends AuthState {}

export class Authenticated extends AuthState {
  constructor(public readonly accessToken: string) {
    super();
  }
}

export class Unauthenticated extends AuthState {}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private initialized = new BehaviorSubject<boolean>(false);
  private readonly tokenService = inject(TokenService);
  private readonly client = inject(AuthClient);

  public readonly authState$ = combineLatest([
    this.initialized,
    this.tokenService.accessToken$,
  ]).pipe(
    filter(([initialized]) => initialized),
    map(([_, token]) => {
      if (token) {
        return new Authenticated(token);
      }

      return new Unauthenticated();
    }),
    startWith(new Unknown()),
    shareReplay(),
  );

  constructor() {
    const refresh = this.tokenService.getRefreshToken();

    if (refresh) {
      this.client
        .refreshUserTokens(refresh)
        .pipe(finalize(() => this.initialized.next(true)))
        .subscribe({
          next: (tokens) => this.tokenService.save(tokens),
          error: (err: AuthError) => this.tokenService.clear(),
        });
    } else {
      this.tokenService.clear();
      this.initialized.next(true);
    }
  }

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
}
