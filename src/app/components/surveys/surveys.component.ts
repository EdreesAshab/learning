import { Component, OnInit } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { SurveyItemComponent } from '../survey-item/survey-item.component';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTabChangeEvent, MatTabsModule } from '@angular/material/tabs';
import { MatGridListModule } from '@angular/material/grid-list';

import { Survey } from '../../Survey';
import data from '../../../../db.json';

@Component({
  selector: 'app-surveys',
  standalone: true,
  imports: [
    NgFor,
    NgIf,
    SurveyItemComponent,
    MatPaginatorModule,
    MatTabsModule,
    MatGridListModule,
  ],
  templateUrl: './surveys.component.html',
  styleUrl: './surveys.component.css',
})
export class SurveysComponent {
  surveys: Survey[] = data.surveys;

  currentSurveys: Survey[];

  publishedSurveys: Survey[] = [];
  expiredSurveys: Survey[] = [];
  closedSurveys: Survey[] = [];

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
    this.getCurrentSurveys();
  }

  getCurrentSurveys(): void {
    this.currentSurveys = [];
    if (this.tabIndex === 0) {
      this.activeTabSurveysLength = this.publishedSurveys.length;
      for (
        let i = this.currentPage * this.pageSize;
        i < (this.currentPage + 1) * this.pageSize &&
        i < this.publishedSurveys.length;
        i++
      ) {
        this.currentSurveys.push(this.publishedSurveys[i]);
      }
    } else if (this.tabIndex === 1) {
      this.activeTabSurveysLength = this.expiredSurveys.length;
      for (
        let i = this.currentPage * this.pageSize;
        i < (this.currentPage + 1) * this.pageSize &&
        i < this.expiredSurveys.length;
        i++
      ) {
        this.currentSurveys.push(this.expiredSurveys[i]);
      }
    } else if (this.tabIndex === 2) {
      this.activeTabSurveysLength = this.closedSurveys.length;
      for (
        let i = this.currentPage * this.pageSize;
        i < (this.currentPage + 1) * this.pageSize &&
        i < this.closedSurveys.length;
        i++
      ) {
        this.currentSurveys.push(this.closedSurveys[i]);
      }
    } else if (this.tabIndex === 3) {
      this.activeTabSurveysLength = this.surveys.length;
      for (
        let i = this.currentPage * this.pageSize;
        i < (this.currentPage + 1) * this.pageSize && i < this.surveys.length;
        i++
      ) {
        this.currentSurveys.push(this.surveys[i]);
      }
    }
  }

  handleTabChangeEvent(tabChangeEvent: MatTabChangeEvent): void {
    this.tabIndex = tabChangeEvent.index;
    this.currentPage = 0;
    this.getCurrentSurveys();
  }
}
