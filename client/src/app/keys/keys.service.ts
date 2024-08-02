import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, finalize, Observable } from 'rxjs';
import { minimumDuration } from '../shared/minimum-duration/minimum-duration';
import { CreateKeyParams, KeysClient } from './keys.client';
import { ApiKey } from './keys.interface';

@Injectable({
  providedIn: 'root',
})
export class KeysService {
  private readonly client = inject(KeysClient);
  private readonly keysSubject = new BehaviorSubject<ApiKey[]>([]);

  public readonly keys$ = this.keysSubject.asObservable();

  constructor() {
    this.client
      .forCurrentUser()
      .subscribe((keys) => this.keysSubject.next(keys));
  }

  public create(params: CreateKeyParams): Observable<{ token: string }> {
    return this.client.create(params).pipe(
      minimumDuration(),
      finalize(() => this.refresh()),
    );
  }

  public refresh(): void {
    this.client
      .forCurrentUser()
      .subscribe((keys) => this.keysSubject.next(keys));
  }

  public delete(id: number): Observable<any> {
    return this.client.delete(id).pipe(
      minimumDuration(),
      finalize(() => this.refresh()),
    );
  }
}
