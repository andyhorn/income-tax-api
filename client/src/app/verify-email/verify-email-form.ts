import { FormArray, FormControl, FormGroup } from '@angular/forms';

type PinControl = FormControl<string | null>;
type PinArray = FormArray<PinControl>;

export enum VerifyEmailFormKeys {
  PIN = 'PIN',
}

export function buildVerifyEmailForm(length: number): FormGroup {
  const digitControls: PinControl[] = [];

  for (let i = 0; i < length; i++) {
    digitControls.push(new FormControl<string | null>(''));
  }

  return new FormGroup({
    [VerifyEmailFormKeys.PIN]: new FormArray(digitControls),
  });
}

export class VerifyEmailFormData {
  constructor(public readonly pin: string) {}

  public static fromFormGroup(form: FormGroup): VerifyEmailFormData {
    const pinControl = form.get(VerifyEmailFormKeys.PIN) as PinArray;
    const digits = pinControl.value.join();

    return new VerifyEmailFormData(digits);
  }
}
