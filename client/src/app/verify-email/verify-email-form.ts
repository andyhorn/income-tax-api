import { FormControl, FormGroup, Validators } from '@angular/forms';

export enum VerifyEmailFormKeys {
  PIN = 'PIN',
}

export function buildVerifyEmailForm(): FormGroup {
  return new FormGroup({
    [VerifyEmailFormKeys.PIN]: new FormControl<string>('', [
      Validators.required,
    ]),
  });
}

export class VerifyEmailFormData {
  constructor(public readonly pin: string) {}

  public static fromFormGroup(form: FormGroup): VerifyEmailFormData {
    return new VerifyEmailFormData(form.get(VerifyEmailFormKeys.PIN)!.value);
  }
}
