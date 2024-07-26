import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { map, switchMap, take } from 'rxjs';
import { environment } from '../environments/environment';
import { TokenService } from './auth/business/token.service';

export const prefixApiUrl = (): HttpInterceptorFn => {
  return (req, next) => {
    return next(
      req.clone({
        url: `${environment.apiUrl}/${req.url}`,
      }),
    );
  };
};

export const injectAuthToken = (): HttpInterceptorFn => {
  return (req, next) => {
    const tokenService = inject(TokenService);

    return tokenService.accessToken$.pipe(
      take(1),
      map((token) => {
        if (token) {
          req = req.clone({
            headers: req.headers.append('Authorization', `Bearer ${token}`),
          });
        }

        return req;
      }),
      switchMap((req) => next(req)),
    );
  };
};
