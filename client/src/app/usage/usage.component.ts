import { CommonModule, DatePipe } from '@angular/common';
import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  ApexAxisChartSeries,
  ApexXAxis,
  NgApexchartsModule,
} from 'ng-apexcharts';
import {
  catchError,
  filter,
  forkJoin,
  map,
  Observable,
  of,
  shareReplay,
  switchMap,
  tap,
  withLatestFrom,
} from 'rxjs';
import { KeysListRoute } from '../app.routes';
import { KeysClient } from '../keys/keys.client';
import { ApiKey } from '../keys/keys.interface';
import { DateMap } from '../shared/date-utils/date-map';
import { plusOneDay, startOfDay } from '../shared/date-utils/date-utils';
import { ToastService } from '../shared/toast/toast.service';
import { UsageClient } from './usage.client';

type SeriesElement = {
  name: string;
  value: number;
};

type ChartData = {
  name: string;
  series: SeriesElement[];
};

@Component({
  selector: 'app-usage',
  standalone: true,
  imports: [CommonModule, NgApexchartsModule],
  providers: [DatePipe],
  templateUrl: './usage.component.html',
  styleUrl: './usage.component.scss',
})
export class UsageComponent implements OnInit {
  constructor(
    private readonly route: ActivatedRoute,
    private readonly usageClient: UsageClient,
    private readonly keysClient: KeysClient,
    private readonly router: Router,
    private readonly toastService: ToastService,
  ) {}

  public loading = false;
  public usage$?: Observable<ApexAxisChartSeries>;
  public totalCount$?: Observable<number>;
  public peak$?: Observable<Date>;
  public xAxis$?: Observable<ApexXAxis>;
  public key$?: Observable<ApiKey>;

  ngOnInit(): void {
    const id$ = this.route.paramMap.pipe(map((params) => +params.get('id')!));

    const load$ = id$.pipe(
      tap(() => (this.loading = true)),
      switchMap((id) =>
        forkJoin({
          usage: this.usageClient.getUsageFor(id).pipe(
            catchError((err) => {
              const isNotFound =
                err instanceof HttpErrorResponse &&
                err.status == HttpStatusCode.NotFound;

              if (isNotFound) {
                new KeysListRoute().go(this.router);
                this.toastService.show({
                  message: 'Key not found!',
                  type: 'danger',
                });
              }

              console.error(err);
              return of(null);
            }),
          ),
          key: this.keysClient.get(id).pipe(
            catchError((err) => {
              console.error(err);
              return of(null);
            }),
          ),
        }),
      ),
      shareReplay(),
      tap(() => (this.loading = false)),
    );

    const usageCounts$ = load$.pipe(
      filter(({ key }) => key != null),
      map(({ usage }) => {
        const usageCounts = new DateMap<number>();

        for (let date of usage?.uses ?? []) {
          const currentCount = usageCounts.get(date) ?? 0;
          usageCounts.set(date, currentCount + 1);
        }

        return usageCounts;
      }),
      shareReplay(),
    );

    const counts$ = load$.pipe(
      filter(({ key }) => key != null),
      withLatestFrom(usageCounts$),
      map(([{ key }, usageCounts]) => {
        const counts: { date: Date; count: number }[] = [];
        const today = startOfDay(new Date());
        let date = startOfDay(key!.createdAt);

        do {
          const count = usageCounts.get(date) ?? 0;

          counts.push({
            count,
            date,
          });

          date = plusOneDay(date);
        } while (startOfDay(date).getTime() <= startOfDay(today).getTime());

        counts.sort(
          (a, b) => startOfDay(a.date).getTime() - startOfDay(b.date).getTime(),
        );

        return counts;
      }),
      shareReplay(),
    );

    this.totalCount$ = counts$.pipe(
      map((counts) => counts.reduce((sum, count) => sum + count.count, 0)),
      shareReplay(),
    );

    this.peak$ = counts$.pipe(
      map((counts) =>
        counts.reduce((max, current) =>
          max.count > current.count ? max : current,
        ),
      ),
      map((peak) => peak.date),
      shareReplay(),
    );

    this.usage$ = counts$.pipe(
      map((counts) => {
        const series: ApexAxisChartSeries = [
          {
            name: 'usage',
            data: counts.map((count) => count.count),
          },
        ];

        return series;
      }),
      shareReplay(),
    );

    this.xAxis$ = counts$.pipe(
      map((counts) => {
        const axis: ApexXAxis = {
          categories: counts.map((count) => count.date),
          type: 'datetime',
          title: {
            text: 'Daily Usage',
          },
        };

        return axis;
      }),
    );

    this.key$ = load$.pipe(map(({ key }) => key!));
  }
}
