import { inject } from '@angular/core';
import { CanActivateFn, Router, Routes } from '@angular/router';
import { distinctUntilChanged, map } from 'rxjs';
import { AuthService } from './auth/business/auth.service';
import { HomeComponent } from './home.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { VerifyEmailComponent } from './verify-email/verify-email.component';

type AuthRequirement = 'authenticated' | 'unauthenticated';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => HomeComponent,
    canActivate: [authGuard()],
  },
  {
    path: 'register',
    loadComponent: () => RegisterComponent,
    canActivate: [authGuard('unauthenticated')],
  },
  {
    path: 'login',
    loadComponent: () => LoginComponent,
    canActivate: [authGuard('unauthenticated')],
  },
  {
    path: 'verify-email',
    loadComponent: () => VerifyEmailComponent,
  },
];

export function authGuard(
  req: AuthRequirement = 'authenticated',
): CanActivateFn {
  return (route, state) => {
    const router = inject(Router);
    const authService = inject(AuthService);

    return authService.accessToken$.pipe(
      map((token) => {
        if (token && req == 'authenticated') {
          return true;
        }

        if (!token && req == 'unauthenticated') {
          return true;
        }

        if (token && req == 'unauthenticated') {
          router.navigateByUrl('/');
          return false;
        }

        router.navigateByUrl('/login');
        return false;
      }),
      distinctUntilChanged(),
    );
  };
}
