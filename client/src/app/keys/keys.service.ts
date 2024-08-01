import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { CreateKeyParams, KeysClient } from './keys.client';
import { ApiKey, ApiKeyCreationResult } from './keys.interface';

@Injectable()
export class KeysService {
  private readonly client = inject(KeysClient);
  private readonly keysSubject = new BehaviorSubject<ApiKey[]>([]);

  public readonly keys$ = this.keysSubject.asObservable();

  constructor() {
    this.client
      .forCurrentUser()
      .subscribe((keys) => this.keysSubject.next(keys));
  }

  public create(params: CreateKeyParams): Observable<ApiKeyCreationResult> {
    return this.client.create(params);
  }

  public refresh(): void {
    this.client
      .forCurrentUser()
      .subscribe((keys) => this.keysSubject.next(keys));
  }

  public delete(id: number): Observable<any> {
    return this.client.delete(id).pipe(finalize(() => this.refresh()));
  }
}
