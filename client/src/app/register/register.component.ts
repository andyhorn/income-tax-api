import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { RouterLink } from '@angular/router';

function mustMatchValidator(field1: string, field2: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value1 = (control as FormGroup).controls[field1];
    const value2 = (control as FormGroup).controls[field2];

    if (value1 != value2) {
      return {
        'must-match': true,
      };
    }

    return null;
  };
}

@Component({
  selector: 'app-register',
  standalone: true,
  templateUrl: './register.component.html',
  imports: [RouterLink, ReactiveFormsModule, CommonModule],
})
export class RegisterComponent {
  public readonly form = new FormGroup(
    {
      email: new FormControl<string>('', {
        validators: [Validators.required, Validators.email],
      }),
      password: new FormControl<string>('', {
        validators: [Validators.required],
      }),
      confirmPassword: new FormControl<string>('', {
        validators: [Validators.required],
      }),
    },
    [mustMatchValidator('password', 'confirmPassword')],
  );

  public submit(): void {
    this.form.markAllAsTouched();

    if (!this.form.valid) {
      return;
    }

    const email = this.form.value['email'];
    const password = this.form.value['password'];

    console.log(email);
    console.log(password);
  }
}
