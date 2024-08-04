import {
  HttpContextToken,
  HttpErrorResponse,
  HttpInterceptorFn,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, finalize, switchMap, tap, throwError } from 'rxjs';
import { environment } from '../environments/environment';
import { TokenService } from './auth/business/token.service';
import { AuthClient } from './auth/data/auth.client';

export const SKIP_JWT = new HttpContextToken<boolean>(() => false);

export const prefixApiUrl = (): HttpInterceptorFn => {
  return (req, next) => {
    return next(
      req.clone({
        url: `${environment.apiUrl}${req.url}`,
      }),
    );
  };
};

export const injectAuthToken = (): HttpInterceptorFn => {
  return (req, next) => {
    if (req.context.get(SKIP_JWT)) {
      return next(req);
    }

    const tokenService = inject(TokenService);
    const accessToken = tokenService.accessToken();

    if (accessToken) {
      const headers = req.headers.set('Authorization', `Bearer ${accessToken}`);

      return next(req.clone({ headers }));
    }

    return next(req);
  };
};

export const refreshTokens = (): HttpInterceptorFn => {
  return (req, next) => {
    let refreshing = false;
    const tokenService = inject(TokenService);
    const client = inject(AuthClient);

    return next(req).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status != 403) {
          return throwError(() => error);
        }

        const refreshToken = tokenService.refreshToken;

        if (!refreshToken || refreshing) {
          return throwError(() => error);
        }

        refreshing = true;

        return client.refreshUserTokens(refreshToken).pipe(
          tap((tokens) => tokenService.save(tokens)),
          catchError((error) => {
            tokenService.clear();
            return throwError(() => error);
          }),
          switchMap((tokens) => {
            return next(
              req.clone({
                headers: req.headers.set(
                  'Authorization',
                  `Bearer ${tokens.access}`,
                ),
              }),
            );
          }),
          finalize(() => (refreshing = false)),
        );
      }),
    );
  };
};
