import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable, shareReplay } from 'rxjs';
import { KeyUsageDtoConverter } from './usage-dto.converter';
import { KeyUsage, KeyUsageDto } from './usage.interface';

@Injectable({
  providedIn: 'root',
})
export class UsageClient {
  constructor(
    private readonly http: HttpClient,
    private readonly converter: KeyUsageDtoConverter,
  ) {}

  public getUsageFor(id: number): Observable<KeyUsage> {
    return this.http.get<KeyUsageDto>(`api-keys/${id}/usage`).pipe(
      map((dto) => {
        return this.converter.fromDto(dto);
      }),
      shareReplay(),
    );
  }
}
