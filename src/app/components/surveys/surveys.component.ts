import { Component, Input } from '@angular/core';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { SurveyItemComponent } from '../survey-item/survey-item.component';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTabChangeEvent, MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { Sort, MatSortModule } from '@angular/material/sort';
import { FormsModule } from '@angular/forms';

import { Survey } from '../../Survey';
import data from '../../../../db.json';

@Component({
  selector: 'app-surveys',
  standalone: true,
  imports: [
    NgFor,
    NgIf,
    NgClass,
    FormsModule,
    SurveyItemComponent,
    MatPaginatorModule,
    MatTabsModule,
    MatGridListModule,
    MatButtonModule,
    MatToolbarModule,
    MatIconModule,
    MatSortModule,
  ],
  templateUrl: './surveys.component.html',
  styleUrl: './surveys.component.css',
})
export class SurveysComponent {
  surveys: Survey[] = data.surveys;

  publishedSurveys: Survey[] = [];
  expiredSurveys: Survey[] = [];
  closedSurveys: Survey[] = [];

  currentSurveys: Survey[];

  searchedSurveys: Survey[];

  selectedSurvey: Survey | null = null;

  @Input() search: string = '';

  currentPage: number = 0;
  pageSize: number = 10;
  tabIndex: number = 0;

  activeTabSurveysLength = this.publishedSurveys.length;

  ngOnInit() {
    for (let survey of this.surveys) {
      if (survey.SURVEY_STATUS_EN === 'Published') {
        this.publishedSurveys.push(survey);
      } else if (survey.SURVEY_STATUS_EN === 'Expired') {
        this.expiredSurveys.push(survey);
      } else if (survey.SURVEY_STATUS_EN === 'Closed') {
        this.closedSurveys.push(survey);
      }
    }

    this.getCurrentSurveys();
  }

  handlePageEvent(pageEvent: PageEvent): void {
    this.currentPage = pageEvent.pageIndex;
    this.pageSize = pageEvent.pageSize;
    this.selectedSurvey = null;
    this.getCurrentSurveys();
  }

  searchByName(surveyStatus: string): void {
    this.selectedSurvey = null;
    this.searchedSurveys = [];
    this.searchedSurveys = this.surveys.filter(
      (survey) =>
        survey.SurveyName.toLowerCase().includes(this.search.toLowerCase()) &&
        (surveyStatus === '' || survey.SURVEY_STATUS_EN === surveyStatus)
    );
  }

  getCurrentSurveys(): void {
    this.currentSurveys = [];
    this.searchedSurveys = [];

    if (this.tabIndex === 0) {
      if (this.search !== '') {
        this.searchByName('Published');
        this.copySurveys(this.searchedSurveys);
        this.activeTabSurveysLength = this.searchedSurveys.length;
      } else {
        this.copySurveys(this.publishedSurveys);
        this.activeTabSurveysLength = this.publishedSurveys.length;
      }
    } else if (this.tabIndex === 1) {
      if (this.search !== '') {
        this.searchByName('Expired');
        this.copySurveys(this.searchedSurveys);
        this.activeTabSurveysLength = this.searchedSurveys.length;
      } else {
        this.copySurveys(this.expiredSurveys);
        this.activeTabSurveysLength = this.expiredSurveys.length;
      }
    } else if (this.tabIndex === 2) {
      if (this.search !== '') {
        this.searchByName('Closed');
        this.copySurveys(this.searchedSurveys);
        this.activeTabSurveysLength = this.searchedSurveys.length;
      } else {
        this.copySurveys(this.closedSurveys);
        this.activeTabSurveysLength = this.closedSurveys.length;
      }
    } else if (this.tabIndex === 3) {
      if (this.search !== '') {
        this.searchByName('');
        this.copySurveys(this.searchedSurveys);
        this.activeTabSurveysLength = this.searchedSurveys.length;
      } else {
        this.copySurveys(this.surveys);
        this.activeTabSurveysLength = this.surveys.length;
      }
    }
  }

  copySurveys(surveysArray: Survey[]): void {
    for (
      let i = this.currentPage * this.pageSize;
      i < (this.currentPage + 1) * this.pageSize && i < surveysArray.length;
      i++
    ) {
      this.currentSurveys.push(surveysArray[i]);
    }
  }

  handleTabChangeEvent(tabChangeEvent: MatTabChangeEvent): void {
    this.tabIndex = tabChangeEvent.index;
    this.currentPage = 0;
    this.selectedSurvey = null;
    this.getCurrentSurveys();
  }

  selectSurvey(survey: Survey, event: Event): void {
    this.selectedSurvey = survey;
  }

  goToDashboard(): void {
    if (
      this.selectedSurvey?.SurveyPeriods &&
      JSON.parse(this.selectedSurvey.SurveyPeriods).length > 1 &&
      !this.selectedSurvey?.SelectedPeriod
    ) {
      alert('Please select a period');
    } else {
      alert(
        `Go to selected Survey: ${this.selectedSurvey?.SRV_ID} - ${this.selectedSurvey?.SurveyNameEn}`
      );
    }
  }
}
