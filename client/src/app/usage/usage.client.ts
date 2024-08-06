import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, shareReplay } from 'rxjs';

@Injectable()
export class UsageClient {
  constructor(private readonly http: HttpClient) {}

  public getUsageFor(id: number): Observable<{ uses: Date[] }> {
    return this.http.get<any>(`api-keys/${id}`).pipe(shareReplay());
  }
}
