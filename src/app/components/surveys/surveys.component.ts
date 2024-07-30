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
import { MatTableModule } from '@angular/material/table';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatDialog } from '@angular/material/dialog';
import { MatMenu, MatMenuModule } from '@angular/material/menu';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { SurveyGridViewItemComponent } from '../survey-grid-view-item/survey-grid-view-item.component';
import { SurveyDialogComponent } from '../survey-dialog/survey-dialog.component';
import { SurveysListViewComponent } from '../surveys-list-view/surveys-list-view.component';
import { SurveysGridViewComponent } from '../surveys-grid-view/surveys-grid-view.component';
import { DatePeriodPickerComponent } from '../date-period-picker/date-period-picker.component';

import { DataService } from '../../services/data.service';
import { UiService } from '../../services/ui.service';

import { LanguagePipe } from '../../pipes/language.pipe';

import { Period, Survey } from '../../types';
import { ToastrService } from 'ngx-toastr';

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
    MatProgressSpinnerModule,
    SurveyGridViewItemComponent,
    SurveysListViewComponent,
    SurveysGridViewComponent,
    DatePeriodPickerComponent,
    LanguagePipe,
  ],
  templateUrl: './surveys.component.html',
  styleUrl: './surveys.component.css',
})
export class SurveysComponent {
  surveys: Survey[];
  surveysPeriods: Period[] = [];

  currentSurveys: Survey[] = [];

  filteredSurveys: Survey[] = [];
  sortedSurveys: Survey[] = [];

  selectedStatus: string = 'Published';
  selectedDatePeriod: Period;
  @Input() searchName: string = '';

  @Input() selectedSurvey: Survey | null = null;

  currentPage: number;
  pageSize: number = 10;
  tabIndex: number = 0;

  activeTabSurveysLength = 0;

  subscription: Subscription;

  showSurveyDialog: boolean = false;

  selectedView: string = 'list';

  readonly SurveyNameAr = signal('');
  readonly SurveyNameEn = signal('');
  readonly dialog = inject(MatDialog);

  sort: Sort;

  @ViewChild(MatMenu) menu!: MatMenu;

  selectedFilterPeriod: Period | null = null;

  isSort: boolean = false;

  language: string;

  isLoading: boolean = true;

  constructor(
    private dataService: DataService,
    private uiService: UiService,
    private toastr: ToastrService
  ) {}

  ngOnInit() {
    this.subscription = this.uiService.selectedSurvey$.subscribe(
      (newSelectedSurvey) => {
        this.selectedSurvey = newSelectedSurvey;
      }
    );

    this.subscription = this.uiService.filterPeriod$.subscribe(
      (selectedFilterPeriod) => {
        this.selectedFilterPeriod = selectedFilterPeriod;
        this.getCurrentSurveys();
      }
    );

    this.subscription = this.uiService.currentPage$.subscribe((currentPage) => {
      this.currentPage = currentPage;
      this.getCurrentSurveys();
    });

    this.subscription = this.uiService.sort$.subscribe((sort) => {
      if (sort) this.sort = sort;
      if (sort?.direction) this.isSort = true;
      else this.isSort = false;
      this.getCurrentSurveys();
    });

    this.subscription = this.uiService.language$.subscribe((language) => {
      this.language = language;
    });

    this.dataService.getSurveys().subscribe((surveys) => {
      this.surveys = surveys;
      this.surveys.map((survey) => {
        let periods: Period[] | null = null;
        if (survey.SurveyPeriods) {
          periods = JSON.parse(survey.SurveyPeriods);
        }
        if (survey.SurveyPeriods && periods && periods.length === 1) {
          survey.SelectedPeriod = periods[0];
          this.surveysPeriods.push(survey.SelectedPeriod);
        }
      });

      this.isLoading = false;

      this.getCurrentSurveys();
    });
  }

  handlePageEvent(pageEvent: PageEvent): void {
    this.uiService.setCurrentPage(pageEvent.pageIndex);
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
    if (!this.surveys) return;

    this.applyFilters();

    this.currentSurveys = [];

    if (this.isSort) {
      this.sortData(this.sort);
      this.copySurveys(this.sortedSurveys);
    } else this.copySurveys(this.filteredSurveys);

    this.activeTabSurveysLength = this.filteredSurveys.length;
  }

  searchByName(): void {
    this.uiService.setCurrentPage(0);
    this.getCurrentSurveys();
  }

  handleTabChangeEvent(tabChangeEvent: MatTabChangeEvent): void {
    this.tabIndex = tabChangeEvent.index;
    this.uiService.setCurrentPage(0);
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
      width: '450px',
      disableClose: true,
      data: {
        ...this.selectedSurvey,
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (
        result &&
        result.Ar &&
        result.Ar().length >= 4 &&
        result.En &&
        result.En().length >= 4
      ) {
        this.SurveyNameAr.set(result.Ar().trim());
        this.SurveyNameEn.set(result.En().trim());

        this.surveys.forEach((survey) => {
          if (survey.SRV_ID === this.selectedSurvey!.SRV_ID) {
            this.selectedSurvey!.SurveyNameAr = this.SurveyNameAr();
            this.selectedSurvey!.SurveyNameEn = this.SurveyNameEn();
            this.selectedSurvey!.SurveyName = this.SurveyNameEn();
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
    this.dataService.updateSurveyName(survey).subscribe({
      next: (response) => {
        console.log(
          `Survey name updated successfully: ${JSON.stringify(response)}`
        );

        this.toastr.success('Survey name updated successfully');

        const index = this.surveys.findIndex(
          (item) => item.SRV_ID === survey.SRV_ID
        );
        if (index !== -1) {
          this.surveys[index] = survey;
        }
      },
      error: (error) => {
        console.error('Error updating item:', error);
        this.toastr.error(
          `Error updating item: ${JSON.stringify(error.message)}`
        );
      },
    });
  }

  handleViewTabChangeEvent(tabChangeEvent: MatTabChangeEvent): void {
    if (tabChangeEvent.index === 0) this.selectedView = 'list';
    else if (tabChangeEvent.index === 1) this.selectedView = 'grid';

    this.selectedSurvey = null;
    this.uiService.updateSelectedSurvey(null);

    if (this.isSort) this.isSort = false;
    this.getCurrentSurveys();
  }

  applyFilters(): void {
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
      !this.selectedFilterPeriod ||
      !this.selectedFilterPeriod.START_DATE ||
      !this.selectedFilterPeriod.END_DATE
    )
      return true;

    if (
      !survey.SelectedPeriod &&
      survey.SurveyPeriods &&
      JSON.parse(survey.SurveyPeriods).length > 1
    )
      return false;

    if (!survey.SelectedPeriod && !survey.SurveyPeriods) return true;

    const surveyStartDate = new Date(survey.SelectedPeriod!.START_DATE);
    const surveyEndDate = new Date(survey.SelectedPeriod!.END_DATE);

    const startDate = new Date(this.selectedFilterPeriod.START_DATE);
    const endDate = new Date(this.selectedFilterPeriod.END_DATE);

    return surveyStartDate >= startDate && surveyEndDate <= endDate;
  }

  filterByName(survey: Survey): boolean {
    return (
      !this.searchName ||
      survey.SurveyNameEn.toString()
        .toLowerCase()
        .includes(this.searchName.toLowerCase()) ||
      survey.SurveyNameAr.toString()
        .toLowerCase()
        .includes(this.searchName.toLowerCase())
    );
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

  sortData(sort: Sort) {
    if (!sort.active || sort.direction === '' || !this.isSort) {
      this.isSort = false;
      return;
    }

    this.isSort = true;

    this.sortedSurveys = this.filteredSurveys.sort((a, b) => {
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
  }

  compare(a: number | string, b: number | string, isAsc: boolean) {
    return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
  }
}
