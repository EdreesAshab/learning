import { Component, Input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { Survey } from '../../Survey';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { MatIconModule } from '@angular/material/icon';
import {
  faCheck,
  faHourglassHalf,
  faPaperPlane,
} from '@fortawesome/free-solid-svg-icons';
import { FormsModule } from '@angular/forms';
import { MatDividerModule } from '@angular/material/divider';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Period } from '../../Period';
import { NgIf, NgStyle } from '@angular/common';

@Component({
  selector: 'app-survey-item',
  standalone: true,
  imports: [
    MatCardModule,
    FontAwesomeModule,
    MatDividerModule,
    FormsModule,
    MatInputModule,
    MatSelectModule,
    MatFormFieldModule,
    MatIconModule,
    NgIf,
    NgStyle,
  ],
  templateUrl: './survey-item.component.html',
  styleUrl: './survey-item.component.css',
})
export class SurveyItemComponent {
  @Input() survey: Survey;
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

  onMouseEnter() {
    this.iconColor = 'white';
  }

  onMouseLeave() {
    this.iconColor = this.color;
  }
}
