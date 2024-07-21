import { inject } from '@angular/core';
import { CanActivateFn, GuardResult, Router, Routes } from '@angular/router';
import { distinctUntilChanged, map, Observable } from 'rxjs';
import { AuthService } from './auth/business/auth.service';
import { HomeComponent } from './home.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { VerifyEmailComponent } from './verify-email/verify-email.component';

type AuthStateType = 'authenticated' | 'unauthenticated';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => HomeComponent,
    canActivate: [isLoggedIn()],
  },
  {
    path: 'register',
    loadComponent: () => RegisterComponent,
    canActivate: [isLoggedOut()],
  },
  {
    path: 'login',
    loadComponent: () => LoginComponent,
    canActivate: [isLoggedOut()],
  },
  {
    path: 'verify-email',
    loadComponent: () => VerifyEmailComponent,
    canActivate: [isLoggedOut(), hasEmail()],
  },
];

export function isLoggedIn(): CanActivateFn {
  return hasAuthState('authenticated', (token, router, service) => {
    router.navigateByUrl('/login');
    return false;
  });
}

export function isLoggedOut(): CanActivateFn {
  return hasAuthState('unauthenticated', (token, router, service) => {
    router.navigateByUrl('/');
    return false;
  });
}

export function hasEmail(): CanActivateFn {
  return hasState('email', (router) => {
    router.navigateByUrl('/login');
    return false;
  });
}

function hasAuthState(
  req: AuthStateType,
  onFailure: (
    token: string | null,
    router: Router,
    authService: AuthService,
  ) => GuardResult,
): CanActivateFn {
  return (_, __) => {
    const router = inject(Router);
    const authService = inject(AuthService);

    return authService.accessToken$.pipe(
      map((token) => {
        if (!!token && req == 'authenticated') {
          return true;
        }

        if (!token && req == 'unauthenticated') {
          return true;
        }

        return onFailure(token, router, authService);
      }),
      distinctUntilChanged(),
    );
  };
}

function hasState(
  key: string,
  onFailure: (router: Router) => GuardResult,
): CanActivateFn {
  return (_, __) => {
    const router = inject(Router);
    const nav = router.getCurrentNavigation();

    if (!nav) {
      return onFailure(router);
    }

    const state = nav.extras.state;

    if (!state) {
      return onFailure(router);
    }

    if (state[key] === undefined) {
      return onFailure(router);
    }

    return true;
  };
}
