import { Routes } from '@angular/router';
import { RegisterComponent } from './register/register.component';
import { HomeComponent } from './home.component';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => HomeComponent,
  },
  {
    path: 'register',
    loadComponent: () => RegisterComponent,
  },
];
