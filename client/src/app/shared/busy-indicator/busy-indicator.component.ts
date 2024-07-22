import { NgIf } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-busy-indicator',
  standalone: true,
  imports: [NgIf],
  templateUrl: './busy-indicator.component.html',
})
export class BusyIndicatorComponent {
  @Input('visible')
  public visible!: boolean;
}
