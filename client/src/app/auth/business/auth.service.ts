import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, distinctUntilChanged, Observable, tap } from 'rxjs';
import {
  AuthLoginParameters,
  AuthRegisterParameters,
  AuthUserTokens,
} from '../data/auth-data.interface';
import { AuthClient } from '../data/auth.client';
import { AuthError } from './auth.error';
import { TokenService } from './token.service';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly tokenService = inject(TokenService);
  private readonly client = inject(AuthClient);
  private readonly accessTokenSubject = new BehaviorSubject<string | null>(
    null,
  );

  public readonly accessToken$ = this.accessTokenSubject
    .asObservable()
    .pipe(distinctUntilChanged());

  constructor() {
    const refresh = this.tokenService.read();

    if (refresh) {
      this.client.refresh(refresh).subscribe({
        next: (tokens) => {
          this.tokenService.write(tokens.refresh);
          this.accessTokenSubject.next(tokens.access);
        },
        error: (err: AuthError) => {
          this.tokenService.delete();
          this.accessTokenSubject.next(null);
        },
      });
    }
  }

  public logout(): void {
    this.tokenService.delete();
    this.accessTokenSubject.next(null);
  }

  public register(params: AuthRegisterParameters): Observable<AuthUserTokens> {
    return this.client.register(params).pipe(
      tap((tokens) => this.tokenService.write(tokens.refresh)),
      tap((tokens) => this.accessTokenSubject.next(tokens.access)),
    );
  }

  public login(params: AuthLoginParameters): Observable<AuthUserTokens> {
    return this.client.login(params).pipe(
      tap((tokens) => this.tokenService.write(tokens.refresh)),
      tap((tokens) => this.accessTokenSubject.next(tokens.access)),
    );
  }
}