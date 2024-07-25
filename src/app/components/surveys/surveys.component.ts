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
import { MatMenu, MatMenuModule } from '@angular/material/menu';

import { SurveyItemComponent } from '../survey-item/survey-item.component';
import { SurveyDialogComponent } from '../survey-dialog/survey-dialog.component';
import { SurveysListViewComponent } from '../surveys-list-view/surveys-list-view.component';
import { SurveysGridViewComponent } from '../surveys-grid-view/surveys-grid-view.component';

import { DataService } from '../../services/data.service';

import { Period, Survey } from '../../types';
import { UiService } from '../../services/ui.service';
import { DatePeriodPickerComponent } from "../date-period-picker/date-period-picker.component";

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
    MatMenuModule,
    SurveyItemComponent,
    SurveysListViewComponent,
    SurveysGridViewComponent,
    DatePeriodPickerComponent
],
  templateUrl: './surveys.component.html',
  styleUrl: './surveys.component.css',
})
export class SurveysComponent {
  surveys: Survey[];

  currentSurveys: Survey[] = [];

  filteredSurveys: Survey[] = [];

  selectedStatus: string = 'Published';
  selectedDatePeriod: Period;
  @Input() searchName: string = '';

  @Input() selectedSurvey: Survey | null = null;

  currentPage: number = 0;
  pageSize: number = 10;
  tabIndex: number = 0;

  activeTabSurveysLength = 0;

  subscription: Subscription;

  showSurveyDialog: boolean = false;

  selectedView: string = 'list';

  readonly SurveyName = signal('');
  readonly dialog = inject(MatDialog);

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatMenu) menu!: MatMenu;

  dataSource: MatTableDataSource<Survey>;

  constructor(private dataService: DataService, private uiService: UiService) {}

  ngOnInit() {
    this.subscription = this.uiService.value$.subscribe((newSelectedSurvey) => {
      this.selectedSurvey = newSelectedSurvey;
    });

    this.dataService.getData().subscribe((surveys) => {
      this.surveys = surveys;

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
    this.applyFilters();

    this.currentSurveys = [];

    this.copySurveys(this.filteredSurveys);
    this.activeTabSurveysLength = this.filteredSurveys.length;
  }

  handleTabChangeEvent(tabChangeEvent: MatTabChangeEvent): void {
    this.tabIndex = tabChangeEvent.index;
    this.currentPage = 0;
    this.selectedSurvey = null;
    this.uiService.updateSelectedSurvey(null);

    if (this.tabIndex === 0) this.selectedStatus = 'Published';
    else if (this.tabIndex === 1) this.selectedStatus = 'Expired';
    else if (this.tabIndex === 2) this.selectedStatus = 'Closed';
    else if (this.tabIndex === 3) this.selectedStatus = '';

    this.getCurrentSurveys();
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

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  handleViewTabChangeEvent(tabChangeEvent: MatTabChangeEvent): void {
    if (tabChangeEvent.index === 0) this.selectedView = 'list';
    else if (tabChangeEvent.index === 1) this.selectedView = 'grid';

    this.selectedSurvey = null;
    this.uiService.updateSelectedSurvey(null);
  }

  applyFilters() {
    this.filteredSurveys = this.surveys.filter(
      (survey) =>
        this.filterByStatus(survey) &&
        this.filterByName(survey) &&
        this.filterByDatePeriod(survey)
    );
  }

  filterByStatus(survey: Survey): boolean {
    return (
      !this.selectedStatus || survey.SURVEY_STATUS_EN === this.selectedStatus
    );
  }

  filterByDatePeriod(survey: Survey): boolean {
    if (
      !this.selectedDatePeriod ||
      !this.selectedDatePeriod.START_DATE ||
      !this.selectedDatePeriod.END_DATE
    )
      return true;

    const surveyStartDate = new Date(survey.SelectedPeriod!.START_DATE);
    const surveyEndDate = new Date(survey.SelectedPeriod!.END_DATE);

    const startDate = new Date(this.selectedDatePeriod.START_DATE);
    const endDate = new Date(this.selectedDatePeriod.END_DATE);

    return surveyStartDate >= startDate && surveyEndDate <= endDate;
  }

  filterByName(survey: Survey): boolean {
    return (
      !this.searchName ||
      survey.SurveyName.toLowerCase().includes(this.searchName.toLowerCase())
    );
  }
}
