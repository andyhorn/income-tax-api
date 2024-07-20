import { Injectable } from '@angular/core';

const REFRESH_TOKEN_KEY = 'refresh-token;';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  public write(token: string): void {
    sessionStorage.setItem(REFRESH_TOKEN_KEY, token);
  }

  public read(): string | null {
    return sessionStorage.getItem(REFRESH_TOKEN_KEY);
  }

  public delete(): void {
    sessionStorage.removeItem(REFRESH_TOKEN_KEY);
  }
}
