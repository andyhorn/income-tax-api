import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiKey } from './keys.interface';

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

  public create(params: CreateKeyParams): Observable<{ token: string }> {
    return this.http.post<{ token: string }>('api-keys', params);
  }

  public delete(id: number): Observable<any> {
    return this.http.delete(`api-keys/${id}`);
  }
}
