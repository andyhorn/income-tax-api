import { AsyncPipe, NgForOf, NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { KeysClient } from './keys.client';

@Component({
  selector: 'app-keys',
  standalone: true,
  imports: [AsyncPipe, NgIf, NgForOf],
  providers: [KeysClient],
  templateUrl: './keys.component.html',
  styleUrl: './keys.component.scss',
})
export class KeysComponent {
  private readonly client = inject(KeysClient);

  public readonly keys$ = this.client.forCurrentUser();
}
