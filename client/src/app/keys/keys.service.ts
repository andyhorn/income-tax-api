import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable, switchMap, tap } from 'rxjs';
import { CreateKeyParams, KeysClient } from './keys.client';
import { ApiKey } from './keys.interface';

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

  public create(params: CreateKeyParams): Observable<boolean> {
    return this.client.create(params).pipe(
      switchMap(() => this.client.forCurrentUser()),
      tap((keys) => this.keysSubject.next(keys)),
      map(() => true),
    );
  }
}
