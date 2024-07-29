import { AsyncPipe, NgIf } from '@angular/common';
import { Component, computed, inject } from '@angular/core';
import { Router } from '@angular/router';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { LoginRoute } from '../../app.routes';
import { Authenticated, AuthService } from '../../auth/business/auth.service';

@Component({
  selector: 'app-top-bar',
  templateUrl: './top-bar.component.html',
  standalone: true,
  imports: [NgbNavModule, AsyncPipe, NgIf],
  styles: ['.spacer { flex: 1; }', '.pointer { cursor: pointer; }'],
})
export class AppTopBarComponent {
  router = inject(Router);
  authService = inject(AuthService);

  public readonly loggedIn = computed(() => {
    const authState = this.authService.authState();

    return authState instanceof Authenticated;
  });

  public logout(): void {
    this.authService.logout().subscribe(() => new LoginRoute().go(this.router));
  }
}
