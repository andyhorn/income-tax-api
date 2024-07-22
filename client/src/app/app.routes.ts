import { inject } from '@angular/core';
import { CanActivateFn, GuardResult, Router, Routes } from '@angular/router';
import { distinctUntilChanged, map } from 'rxjs';
import { AuthService } from './auth/business/auth.service';
import { HomeComponent } from './home.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { SimpleDataRoute, SimpleRoute, SimpleRouteData } from './routes/routes';
import { VerifyEmailComponent } from './verify-email/verify-email.component';

type AuthStateType = 'authenticated' | 'unauthenticated';

export class HomeRoute extends SimpleRoute {
  constructor() {
    super('');
  }
}

export class LoginRoute extends SimpleRoute {
  constructor() {
    super('login');
  }
}

export class RegisterRoute extends SimpleRoute {
  constructor() {
    super('register');
  }
}

export class VerifyEmailRouteData extends SimpleRouteData {
  constructor(private readonly email: string) {
    super();
  }

  public override state = { email: this.email };
}

export class VerifyEmailRoute extends SimpleDataRoute<VerifyEmailRouteData> {
  constructor() {
    super('verify-email');
  }
}

export const routes: Routes = [
  {
    path: new HomeRoute().path(),
    loadComponent: () => HomeComponent,
    canActivate: [isLoggedIn()],
  },
  {
    path: new RegisterRoute().path(),
    loadComponent: () => RegisterComponent,
    canActivate: [isLoggedOut()],
  },
  {
    path: new LoginRoute().path(),
    loadComponent: () => LoginComponent,
    canActivate: [isLoggedOut()],
  },
  {
    path: new VerifyEmailRoute().path(),
    loadComponent: () => VerifyEmailComponent,
    canActivate: [
      isLoggedOut(),
      hasEmail(),
      isComingFrom(
        [new LoginRoute().fullPath(), new RegisterRoute().fullPath()],
        (router) => new LoginRoute().go(router),
      ),
    ],
  },
];

function isLoggedIn(): CanActivateFn {
  return hasAuthState('authenticated', (token, router, service) => {
    router.navigateByUrl(new LoginRoute().fullPath());
    return false;
  });
}

function isLoggedOut(): CanActivateFn {
  return hasAuthState('unauthenticated', (token, router, service) => {
    router.navigateByUrl(new HomeRoute().fullPath());
    return false;
  });
}

function hasEmail(): CanActivateFn {
  return hasState('email', (router) => {
    router.navigateByUrl(new LoginRoute().fullPath());
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

function isComingFrom(
  routes: string[],
  onFailure: (router: Router) => void,
): CanActivateFn {
  return (_, __) => {
    const router = inject(Router);
    const match = routes.some((route) => route == router.url);

    if (!match) {
      onFailure(router);
    }

    return match;
  };
}
