import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, shareReplay } from 'rxjs';
import { ApiKeyDtoConverter } from './api-key-dto.converter';
import { ApiKey, ApiKeyDto } from './keys.interface';

export interface CreateKeyParams {
  nickname?: string;
}

@Injectable({
  providedIn: 'root',
})
export class KeysClient {
  constructor(
    private readonly http: HttpClient,
    private readonly converter: ApiKeyDtoConverter,
  ) {}

  public forCurrentUser(): Observable<ApiKey[]> {
    return this.http.get<ApiKeyDto[]>('api-keys').pipe(
      shareReplay(),
      map((dtos) => {
        return dtos.map((dto) => {
          return this.converter.fromDto(dto);
        });
      }),
    );
  }

  public create(params: CreateKeyParams): Observable<{ token: string }> {
    return this.http.post<{ token: string }>('api-keys', params);
  }

  public delete(id: number): Observable<any> {
    return this.http.delete(`api-keys/${id}`);
  }

  public get(id: number): Observable<ApiKey> {
    return this.http.get<ApiKeyDto>(`api-keys/${id}`).pipe(
      shareReplay(),
      map((key) => this.converter.fromDto(key)),
    );
  }
}
