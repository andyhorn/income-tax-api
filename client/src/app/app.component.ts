import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AppTopBarComponent } from './layouts/top-bar/top-bar.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, AppTopBarComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'client';
}
