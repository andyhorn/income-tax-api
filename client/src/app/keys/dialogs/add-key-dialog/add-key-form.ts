import { FormControl, FormGroup } from '@angular/forms';

export enum AddKeyFormKeys {
  NICKNAME = 'NICKNAME',
}

export function buildKeyForm(): FormGroup {
  return new FormGroup({
    [AddKeyFormKeys.NICKNAME]: new FormControl<string>(''),
  });
}

export class AddKeyFormData {
  constructor(public readonly nickname?: string) {}

  public static fromForm(form: FormGroup): AddKeyFormData {
    return new AddKeyFormData(form.value[AddKeyFormKeys.NICKNAME]);
  }
}
