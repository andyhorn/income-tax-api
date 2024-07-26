import { Injectable } from '@angular/core';
import { BehaviorSubject, shareReplay } from 'rxjs';
import { AuthUserTokens } from '../data/auth-data.interface';

const REFRESH_TOKEN_KEY = 'refresh-token';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  private readonly accessTokenSubject = new BehaviorSubject<string | null>(
    null,
  );

  public readonly accessToken$ = this.accessTokenSubject
    .asObservable()
    .pipe(shareReplay());

  public save(tokens: AuthUserTokens): void {
    sessionStorage.setItem(REFRESH_TOKEN_KEY, tokens.refresh);
    this.accessTokenSubject.next(tokens.access);
  }

  public clear(): void {
    sessionStorage.removeItem(REFRESH_TOKEN_KEY);
    this.accessTokenSubject.next(null);
  }

  public getRefreshToken(): string | null {
    return sessionStorage[REFRESH_TOKEN_KEY];
  }
}
