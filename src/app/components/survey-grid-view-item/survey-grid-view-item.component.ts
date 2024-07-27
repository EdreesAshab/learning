import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';

import { Survey, Period } from '../../types';

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
  ],
  templateUrl: './survey-grid-view-item.component.html',
  styleUrl: './survey-grid-view-item.component.css',
})
export class SurveyGridViewItemComponent {
  @Input() survey: Survey;
  @Input() isSelected: boolean;
  surveyIcon = 'check';
  color = '#02CA98';
  iconColor = this.color;

  surveyPeriods: Period[] = [];

  ngOnInit() {
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
