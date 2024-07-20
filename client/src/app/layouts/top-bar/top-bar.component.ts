import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { NgbNavModule } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../../auth/business/auth.service';
import { AsyncPipe, NgIf } from '@angular/common';

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
}
