import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';
import {
  injectAuthToken,
  prefixApiUrl,
  refreshTokens,
} from './app.interceptors';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(
      withInterceptors([prefixApiUrl(), injectAuthToken(), refreshTokens()]),
    ),
    BrowserAnimationsModule.withConfig({
      disableAnimations: false,
    }).providers!,
  ],
};
