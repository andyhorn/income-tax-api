import { NgIf } from '@angular/common';
import { Component, ElementRef, inject, ViewChild } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, ReactiveFormsModule, NgIf],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent {
  public readonly form = new FormGroup({
    email: new FormControl<string>('', {
      validators: [Validators.required, Validators.email],
    }),
    password: new FormControl<string>('', {
      validators: [Validators.required],
    }),
  });

  @ViewChild('email')
  private readonly email!: ElementRef;

  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  public login(): void {
    this.form.markAllAsTouched();

    if (!this.form.valid) {
      return;
    }

    const email = this.form.get('email')!.value!;
    const password = this.form.get('password')!.value!;

    this.authService.login({ email, password }).subscribe({
      error: () => {
        (this.email.nativeElement as HTMLInputElement).focus();
        this.form.reset();
      },
      complete: () => {
        this.router.navigateByUrl('/');
      },
    });
  }
}
