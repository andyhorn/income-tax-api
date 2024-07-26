import { Component } from '@angular/core';
import { KeysComponent } from './keys/keys.component';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [KeysComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
})
export class HomeComponent {}
