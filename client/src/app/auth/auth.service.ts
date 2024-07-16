import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export type RegisterParams = {
  email: string;
  password: string;
  confirmPassword: string;
};

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly http = inject(HttpClient);

  public register({
    email,
    password,
    confirmPassword,
  }: RegisterParams): Observable<any> {
    return this.http.post<any>('auth/sign-up', {
      email,
      password,
      confirmPassword,
    });
  }
}
