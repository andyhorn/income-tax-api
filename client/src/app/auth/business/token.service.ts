import { Injectable, Signal, signal } from '@angular/core';
import { AuthUserTokens } from '../data/auth-data.interface';

const REFRESH_TOKEN_KEY = 'refresh-token';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  private readonly accessTokenSignal = signal<string | null>(null);

  public get accessToken(): Signal<string | null> {
    return this.accessTokenSignal.asReadonly();
  }

  public get refreshToken(): string | null {
    return localStorage[REFRESH_TOKEN_KEY];
  }

  public save(tokens: AuthUserTokens): void {
    localStorage.setItem(REFRESH_TOKEN_KEY, tokens.refresh);
    this.accessTokenSignal.set(tokens.access);
  }

  public clear(): void {
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    this.accessTokenSignal.set(null);
  }
}
