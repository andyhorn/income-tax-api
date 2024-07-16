import { Injectable } from '@angular/core';

const AUTH_TOKEN_KEY = 'auth-token';
const REFRESH_TOKEN_KEY = 'refresh-token;';

export type TokenType = 'access' | 'refresh';

@Injectable({
  providedIn: 'root',
})
export class TokenService {
  public write(token: string, type: TokenType): void {
    sessionStorage.setItem(
      type == 'access' ? AUTH_TOKEN_KEY : REFRESH_TOKEN_KEY,
      token,
    );
  }

  public read(type: TokenType): string | null {
    return sessionStorage.getItem(
      type == 'access' ? AUTH_TOKEN_KEY : REFRESH_TOKEN_KEY,
    );
  }

  public delete(type: TokenType): void {
    sessionStorage.removeItem(
      type == 'access' ? AUTH_TOKEN_KEY : REFRESH_TOKEN_KEY,
    );
  }
}
