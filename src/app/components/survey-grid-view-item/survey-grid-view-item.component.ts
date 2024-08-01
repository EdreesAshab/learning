import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { LanguagePipe } from '../../pipes/language.pipe';

import { type Survey } from '../../models/Survey.model';
import { type Period } from '../../models/Period.model';
import { Subscription } from 'rxjs';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-survey-grid-view-item',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatCardModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    LanguagePipe,
  ],
  templateUrl: './survey-grid-view-item.component.html',
  styleUrl: './survey-grid-view-item.component.css',
})
export class SurveyGridViewItemComponent implements OnInit {
  @Input() survey: Survey;
  @Input() isSelected: boolean;
  surveyIcon = 'check';
  color = '#02CA98';
  iconColor = this.color;

  textColor = '#1d1b1e';

  subscription: Subscription;

  surveyPeriods: Period[] = [];

  constructor(private themeService: ThemeService) {}

  ngOnInit() {
    this.subscription = this.themeService.darkTheme$.subscribe(
      (isDarkTheme) => {
        if (isDarkTheme) {
          this.textColor = '#ffffff';
        } else this.textColor = '#1d1b1e';
      }
    );

    if (this.survey.SurveyPeriods)
      this.surveyPeriods = JSON.parse(this.survey.SurveyPeriods);

    if (this.survey.SURVEY_STATUS_EN === 'Expired') {
      this.surveyIcon = 'alarm';
      this.color = '#8D8D8D';
    } else if (this.survey.SURVEY_STATUS_EN === 'Closed') {
      this.surveyIcon = 'lock';
      this.color = '#8D8D8D';
    }
  }

  onMouseEnter(): void {
    this.iconColor = 'white';
  }

  onMouseLeave(): void {
    this.iconColor = this.color;
  }

  changePeriod(period: Period): void {
    this.survey.SelectedPeriod = period;
  }
}
