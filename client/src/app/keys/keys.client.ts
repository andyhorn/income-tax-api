import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiKey, ApiKeyCreationResult } from './keys.interface';

export interface CreateKeyParams {
  nickname?: string;
}

@Injectable({
  providedIn: 'root',
})
export class KeysClient {
  constructor(private readonly http: HttpClient) {}

  public forCurrentUser(): Observable<ApiKey[]> {
    return this.http.get<ApiKey[]>('api-keys');
  }

  public create(params: CreateKeyParams): Observable<ApiKeyCreationResult> {
    return this.http.post<ApiKeyCreationResult>('api-keys', params);
  }
}
