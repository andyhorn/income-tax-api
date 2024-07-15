import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { RouterLink } from '@angular/router';

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

  public login(): void {
    this.form.markAllAsTouched();

    if (!this.form.valid) {
      return;
    }

    const email = this.form.get('email')?.value;
    const password = this.form.get('password')?.value;

    console.log(email);
    console.log(password);
  }
}
