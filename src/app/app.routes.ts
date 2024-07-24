import { Routes } from '@angular/router';
import { PasswordComponent } from './components/password/password.component';
import { SurveysComponent } from './components/surveys/surveys.component';

export const routes: Routes = [
  { path: '', component: SurveysComponent },
  { path: 'password', component: PasswordComponent },
];
