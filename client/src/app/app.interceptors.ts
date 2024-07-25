import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { map, switchMap, take, tap } from 'rxjs';
import { environment } from '../environments/environment';
import { AuthService } from './auth/business/auth.service';

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
    const authService = inject(AuthService);

    return authService.accessToken$.pipe(
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
