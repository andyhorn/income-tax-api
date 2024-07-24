import { Injectable } from '@angular/core';

const REFRESH_TOKEN_KEY = 'refresh-token';

@Injectable({
  providedIn: 'root',
})
export class RefreshTokenService {
  public save(token: string): void {
    sessionStorage.setItem(REFRESH_TOKEN_KEY, token);
  }

  public get(): string | null {
    return sessionStorage.getItem(REFRESH_TOKEN_KEY);
  }

  public remove(): void {
    sessionStorage.removeItem(REFRESH_TOKEN_KEY);
  }
}
