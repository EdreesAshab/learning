import { Component, ViewChild, Input, SimpleChanges } from '@angular/core';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatSort, MatSortModule, Sort } from '@angular/material/sort';
import { CommonModule } from '@angular/common';
import { Survey } from '../../types';

import { FormsModule } from '@angular/forms';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatRadioModule } from '@angular/material/radio';
import { UiService } from '../../services/ui.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-surveys-list-view',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    FormsModule,
    MatFormFieldModule,
    MatCardModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatSortModule,
    MatRadioModule,
  ],
  templateUrl: './surveys-list-view.component.html',
  styleUrl: './surveys-list-view.component.css',
})
export class SurveysListViewComponent {
  displayedColumns: string[] = ['radio', 'surveyName', 'from', 'to', 'period'];

  @ViewChild(MatSort) sort: MatSort;

  @Input() surveys: Survey[];
  dataSource: MatTableDataSource<Survey>;

  sortedData: Survey[];

  selectedSurvey: Survey | null = null;

  subscription: Subscription;

  constructor(private uiService: UiService) {}

  ngOnInit() {
    this.dataSource = new MatTableDataSource(this.surveys);
    this.sortedData = this.surveys.slice();

    this.subscription = this.uiService.value$.subscribe((newSelectedSurvey) => {
      this.selectedSurvey = newSelectedSurvey;
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

  getStartDateString(date: string | null): string {
    if (date === null) return '';
    return JSON.parse(date)[0].START_DATE.substr(
      0,
      JSON.parse(date)[0].START_DATE.indexOf('T')
    );
  }

  getEndDateString(date: string | null): string {
    if (date === null) return '';
    return JSON.parse(date)[0].END_DATE.substr(
      0,
      JSON.parse(date)[0].END_DATE.indexOf('T')
    );
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['surveys'] && !changes['surveys'].firstChange) {
      this.dataSource = new MatTableDataSource(this.surveys);
      this.sortData(this.sort);
    }
  }

  sortData(sort: Sort) {
    const data = this.surveys.slice();
    if (!sort.active || sort.direction === '') {
      this.sortedData = data;
      return;
    }

    this.sortedData = data.sort((a, b) => {
      const isAsc = sort.direction === 'asc';
      switch (sort.active) {
        case 'surveyName':
          return this.compare(
            a.SurveyName.toLowerCase(),
            b.SurveyName.toLowerCase(),
            isAsc
          );
        case 'from':
          return this.compare(
            this.getStartDateString(a.SurveyPeriods!),
            this.getStartDateString(b.SurveyPeriods!),
            isAsc
          );
        case 'to':
          return this.compare(
            this.getEndDateString(a.SurveyPeriods!),
            this.getEndDateString(b.SurveyPeriods!),
            isAsc
          );
        default:
          return 0;
      }
    });

    this.dataSource = new MatTableDataSource(this.sortedData);
  }

  compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }
}
