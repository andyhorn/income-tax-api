import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  GuardResult,
  Router,
  Routes,
} from '@angular/router';
import {
  Authenticated,
  AuthService,
  Unauthenticated,
} from './auth/business/auth.service';
import { HomeComponent } from './home.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import {
  ChildRoute,
  ParameterMap,
  SimpleDataRoute,
  SimpleRoute,
  SimpleRouteData,
} from './routes/routes';
import { VerifyEmailComponent } from './verify-email/verify-email.component';
import { UsageComponent } from './usage/usage.component';

type AuthStateType = 'authenticated' | 'unauthenticated';

export class KeysListRoute extends SimpleRoute {
  constructor() {
    super('keys');
  }
}

export class LoginRouteData extends SimpleRouteData {
  constructor(public readonly redirect?: string) {
    super();
  }

  public static fromRoute(route: ActivatedRouteSnapshot): LoginRouteData {
    const query = route.queryParams;

    return new LoginRouteData(query['redirect']);
  }

  public static empty = new LoginRouteData();

  public override get query(): { [key: string]: string } {
    if (this.redirect) {
      return {
        url: this.redirect,
      };
    }

    return {};
  }
}

export class LoginRoute extends SimpleDataRoute<LoginRouteData> {
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

  public override get state() {
    return { email: this.email };
  }
}

export class VerifyEmailRoute extends SimpleDataRoute<VerifyEmailRouteData> {
  constructor() {
    super('verify-email');
  }
}

export class KeyUsageRouteData extends SimpleRouteData {
  constructor(private readonly id: number) {
    super();
  }

  public override get parameters(): ParameterMap {
    return {
      id: this.id.toFixed(0),
    };
  }
}

export class KeyUsageRoute
  extends SimpleDataRoute<KeyUsageRouteData>
  implements ChildRoute<KeysListRoute>
{
  constructor() {
    super(':id');
  }
  public readonly parent = new KeysListRoute();
}

export const routes: Routes = [
  {
    path: new KeysListRoute().path(),
    loadComponent: () => HomeComponent,
    canActivate: [isLoggedIn()],
    children: [
      {
        path: new KeyUsageRoute().path(),
        loadComponent: () => UsageComponent,
      },
    ],
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
        [
          new LoginRoute().fullPath(LoginRouteData.empty),
          new RegisterRoute().fullPath(),
        ],
        (router) => new LoginRoute().go(router, LoginRouteData.empty),
      ),
    ],
  },
  {
    path: '**',
    redirectTo: new KeysListRoute().fullPath(),
  },
];

function isLoggedIn(): CanActivateFn {
  return hasAuthState('authenticated', (router) => {
    return router.parseUrl(new LoginRoute().fullPath(LoginRouteData.empty));
  });
}

function isLoggedOut(): CanActivateFn {
  return hasAuthState('unauthenticated', (router) => {
    return router.parseUrl(new KeysListRoute().fullPath());
  });
}

function hasEmail(): CanActivateFn {
  return hasState('email', (router) => {
    return router.parseUrl(new LoginRoute().fullPath(LoginRouteData.empty));
  });
}

function hasAuthState(
  req: AuthStateType,
  onFailure: (router: Router) => GuardResult,
): CanActivateFn {
  return (_, __) => {
    const router = inject(Router);
    const authService = inject(AuthService);
    const state = authService.authState();

    if (state instanceof Authenticated && req == 'authenticated') {
      return true;
    }

    if (state instanceof Unauthenticated && req == 'unauthenticated') {
      return true;
    }

    return onFailure(router);
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
