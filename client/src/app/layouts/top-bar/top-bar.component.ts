import { AsyncPipe, NgIf } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { finalize } from 'rxjs';
import {
  HomeRoute,
  LoginRoute,
  LoginRouteData,
  RegisterRoute,
} from '../../app.routes';
import { Authenticated, AuthService } from '../../auth/business/auth.service';
import { ToastService } from '../../shared/toast/toast.service';

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  standalone: true,
  imports: [NgbNavModule, AsyncPipe, NgIf],
  styles: ['.spacer { flex: 1; }', '.pointer { cursor: pointer; }'],
})
export class AppTopBarComponent {
  private readonly router = inject(Router);
  private readonly authService = inject(AuthService);
  private readonly toastService = inject(ToastService);

  public readonly loggedIn = computed(() => {
    const authState = this.authService.authState();

    return authState instanceof Authenticated;
  });

  public toHome(): void {
    new HomeRoute().go(this.router);
  }

  public toLogin(): void {
    new LoginRoute().go(this.router, LoginRouteData.empty);
  }

  public toRegister(): void {
    new RegisterRoute().go(this.router);
  }

  public logout(): void {
    this.authService
      .logout()
      .pipe(
        finalize(() =>
          this.toastService.show({
            message: 'Logged out',
            type: 'success',
          }),
        ),
      )
      .subscribe(() => new LoginRoute().go(this.router, LoginRouteData.empty));
  }
}
