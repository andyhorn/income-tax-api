import { AsyncPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  catchError,
  forkJoin,
  map,
  Observable,
  of,
  switchMap,
  tap,
} from 'rxjs';
import { KeysClient } from '../keys/keys.client';
import { ApiKey } from '../keys/keys.interface';
import { UsageClient } from './usage.client';

@Component({
  selector: 'app-usage',
  standalone: true,
  imports: [AsyncPipe],
  providers: [UsageClient, KeysClient],
  templateUrl: './usage.component.html',
  styleUrl: './usage.component.scss',
})
export class UsageComponent implements OnInit {
  constructor(
    private readonly route: ActivatedRoute,
    private readonly usageClient: UsageClient,
    private readonly keysClient: KeysClient,
  ) {}

  public loading = false;
  public usage$?: Observable<Date[]>;
  public key$?: Observable<ApiKey>;

  ngOnInit(): void {
    const id$ = this.route.paramMap.pipe(map((params) => +params.get('id')!));

    const load$ = id$.pipe(
      tap(() => (this.loading = true)),
      switchMap((id) =>
        forkJoin([
          this.usageClient.getUsageFor(id).pipe(
            catchError((err) => {
              console.error(err);
              return of(null);
            }),
          ),
          this.keysClient.get(id).pipe(
            catchError((err) => {
              console.error(err);
              return of(null);
            }),
          ),
        ]),
      ),
      tap(() => (this.loading = false)),
    );

    this.usage$ = load$.pipe(map(([usage]) => usage ?? []));

    this.key$ = load$.pipe(map(([_, key]) => key!));
  }
}
