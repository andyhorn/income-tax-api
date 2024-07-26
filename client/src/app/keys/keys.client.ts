import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiKey } from './keys.interface';

@Injectable({
  providedIn: 'root',
})
export class KeysClient {
  constructor(private readonly http: HttpClient) {}

  public forCurrentUser(): Observable<ApiKey[]> {
    return this.http.get<ApiKey[]>('api-keys');
  }
}
