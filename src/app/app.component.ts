import { Component } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';

import { HeaderComponent } from './components/header/header.component';
import { SurveysComponent } from './components/surveys/surveys.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterModule, RouterOutlet, HeaderComponent, SurveysComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent {}
