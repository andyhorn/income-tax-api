import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
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
    const accessToken = tokenService.accessToken;

    if (accessToken) {
      req = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${accessToken}`),
      });
    }

    return next(req);
  };
};
