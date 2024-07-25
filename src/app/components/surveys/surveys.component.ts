import { Component, inject, Input, signal, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Subscription } from 'rxjs';

import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTabChangeEvent, MatTabsModule } from '@angular/material/tabs';
import { MatButtonModule } from '@angular/material/button';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';

import { SurveyItemComponent } from '../survey-item/survey-item.component';
import { SurveyDialogComponent } from '../survey-dialog/survey-dialog.component';
import { SurveysListViewComponent } from '../surveys-list-view/surveys-list-view.component';
import { SurveysGridViewComponent } from '../surveys-grid-view/surveys-grid-view.component';

import { DataService } from '../../services/data.service';

import { Survey } from '../../types';
import { UiService } from '../../services/ui.service';

@Component({
  selector: 'app-surveys',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatPaginatorModule,
    MatTabsModule,
    MatGridListModule,
    MatButtonModule,
    MatToolbarModule,
    MatIconModule,
    MatFormFieldModule,
    MatTableModule,
    MatSortModule,
    SurveyItemComponent,
    SurveysListViewComponent,
    SurveysGridViewComponent,
  ],
  templateUrl: './surveys.component.html',
  styleUrl: './surveys.component.css',
})
export class SurveysComponent {
  surveys: Survey[];

  publishedSurveys: Survey[] = [];
  expiredSurveys: Survey[] = [];
  closedSurveys: Survey[] = [];

  currentSurveys: Survey[];

  searchedSurveys: Survey[];

  @Input() selectedSurvey: Survey | null = null;

  @Input() search: string = '';

  currentPage: number = 0;
  pageSize: number = 10;
  tabIndex: number = 0;

  activeTabSurveysLength = this.publishedSurveys.length;

  subscription: Subscription;

  showSurveyDialog: boolean = false;

  selectedView: string = 'list';

  readonly SurveyName = signal('');
  readonly dialog = inject(MatDialog);

  @ViewChild(MatSort) sort: MatSort;

  dataSource: MatTableDataSource<Survey>;

  constructor(private dataService: DataService, private uiService: UiService) {}

  ngOnInit() {
    this.subscription = this.uiService.value$.subscribe((newSelectedSurvey) => {
      this.selectedSurvey = newSelectedSurvey;
    });

    this.dataService.getData().subscribe((surveys) => {
      this.surveys = surveys;

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
    });
  }

  handlePageEvent(pageEvent: PageEvent): void {
    this.currentPage = pageEvent.pageIndex;
    this.pageSize = pageEvent.pageSize;
    this.selectedSurvey = null;
    this.uiService.updateSelectedSurvey(null);
    this.getCurrentSurveys();
  }

  searchByName(surveyStatus: string): void {
    this.selectedSurvey = null;
    this.uiService.updateSelectedSurvey(null);
    this.searchedSurveys = [];
    this.searchedSurveys = this.surveys.filter(
      (survey) =>
        survey.SurveyName.toLowerCase().includes(this.search.toLowerCase()) &&
        (surveyStatus === '' || survey.SURVEY_STATUS_EN === surveyStatus)
    );
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

    this.dataSource = new MatTableDataSource(this.currentSurveys);
  }

  handleTabChangeEvent(tabChangeEvent: MatTabChangeEvent): void {
    this.tabIndex = tabChangeEvent.index;
    this.currentPage = 0;
    this.selectedSurvey = null;
    this.uiService.updateSelectedSurvey(null);
    this.getCurrentSurveys();
  }

  toggleSurveyDialog(): void {
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

  openDialog(): void {
    const dialogRef = this.dialog.open(SurveyDialogComponent, {
      data: {
        ...this.selectedSurvey,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result && result.length >= 4) {
        this.SurveyName.set(result.trim());

        this.surveys.forEach((survey) => {
          if (survey.SRV_ID === this.selectedSurvey!.SRV_ID) {
            this.selectedSurvey!.SurveyName = this.SurveyName();
            this.updateSurvey(this.selectedSurvey!);
            this.getCurrentSurveys();
          }
        });
        this.selectedSurvey = null;
        this.uiService.updateSelectedSurvey(null);
      } else if (result && result.length < 4) {
        alert('The new name should be at least 4 characters');
        this.openDialog();
      } else {
        this.selectedSurvey = null;
        this.uiService.updateSelectedSurvey(null);
      }
    });
  }

  updateSurvey(survey: Survey) {
    this.dataService.updateItem(survey).subscribe({
      next: (response) => {
        console.log(`Survey name updated successfully: ${response}`);
        const index = this.surveys.findIndex(
          (item) => item.SRV_ID === survey.SRV_ID
        );
        if (index !== -1) {
          this.surveys[index] = survey;
        }
      },
      error: (error) => {
        console.error('Error updating item:', error);
      },
    });
  }

  displayedColumns: string[] = ['surveyName', 'from', 'to', 'period'];

  getStartDateString(date: string): string {
    return JSON.parse(date)[0].START_DATE.substr(
      0,
      JSON.parse(date)[0].START_DATE.indexOf('T')
    );
  }

  getEndDateString(date: string): string {
    return JSON.parse(date)[0].END_DATE.substr(
      0,
      JSON.parse(date)[0].END_DATE.indexOf('T')
    );
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  handleViewTabChangeEvent(tabChangeEvent: MatTabChangeEvent): void {
    if (tabChangeEvent.index === 0) this.selectedView = 'list';
    else if (tabChangeEvent.index === 1) this.selectedView = 'grid';

    this.selectedSurvey = null;
    this.uiService.updateSelectedSurvey(null);
  }
}
