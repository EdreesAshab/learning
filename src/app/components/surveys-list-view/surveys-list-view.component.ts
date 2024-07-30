import { Component, ViewChild, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { Subscription } from 'rxjs';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';

import { UiService } from '../../services/ui.service';

import { LanguagePipe } from '../../pipes/language.pipe';

import { Period } from '../../models/Period.model';
import { Survey } from '../../models/Survey.model';

@Component({
  selector: 'app-surveys-list-view',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    MatFormFieldModule,
    MatCardModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatRadioModule,
    MatTableModule,
    MatSortModule,
    LanguagePipe,
  ],
  templateUrl: './surveys-list-view.component.html',
  styleUrl: './surveys-list-view.component.css',
})
export class SurveysListViewComponent {
  displayedColumns: string[] = ['radio', 'surveyName', 'from', 'to', 'period'];

  @ViewChild(MatSort) sort: MatSort;

  @Input() surveys: Survey[];

  selectedSurvey: Survey | null = null;

  subscription: Subscription;

  language: string;

  constructor(private uiService: UiService) {}

  ngOnInit() {
    this.subscription = this.uiService.selectedSurvey$.subscribe(
      (newSelectedSurvey) => {
        this.selectedSurvey = newSelectedSurvey;
      }
    );

    this.subscription = this.uiService.language$.subscribe((language) => {
      this.language = language;
    });
  }

  selectSurvey(survey: Survey) {
    this.selectedSurvey = survey;
    this.uiService.updateSelectedSurvey(this.selectedSurvey);
  }

  isSelected(id: number): boolean {
    return (
      this.selectedSurvey !== null &&
      this.selectedSurvey !== undefined &&
      this.selectedSurvey.SRV_ID === id
    );
  }

  checkIfNotOneDate(date: string) {
    return JSON.parse(date).length !== 1;
  }

  getStartDateString(date: string | Period | null): string {
    if (date === null) return '';

    if (typeof date === 'object') {
      return date.START_DATE.substr(0, date.START_DATE.indexOf('T'));
    } else if (Array.isArray(JSON.parse(date)))
      return JSON.parse(date)[0].START_DATE.substr(
        0,
        JSON.parse(date)[0].START_DATE.indexOf('T')
      );

    return '';
  }

  getEndDateString(date: string | Period | null): string {
    if (date === null) return '';

    if (typeof date === 'object') {
      return date.END_DATE.substr(0, date.END_DATE.indexOf('T'));
    } else if (Array.isArray(JSON.parse(date)))
      return JSON.parse(date)[0].END_DATE.substr(
        0,
        JSON.parse(date)[0].END_DATE.indexOf('T')
      );

    return '';
  }

  sortData() {
    this.uiService.setSort(this.sort);
  }

  getParsedPeriods(periodStr: string): Period[] {
    return JSON.parse(periodStr);
  }

  changePeriod(period: Period, survey: Survey): void {
    survey.SelectedPeriod = period;
  }
}
