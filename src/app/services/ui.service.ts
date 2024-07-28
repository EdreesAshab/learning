import { Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs';

import { Sort } from '@angular/material/sort';

import { Period, Survey } from '../types';

@Injectable({
  providedIn: 'root',
})
export class UiService {
  private selectedSurveySubject = new BehaviorSubject<Survey | null>(null);
  private filterPeriodSubject = new BehaviorSubject<Period | null>(null);
  private sortSubject = new BehaviorSubject<Sort | null>(null);
  private currentPageSubject = new BehaviorSubject<number>(0);

  selectedSurvey$ = this.selectedSurveySubject.asObservable();
  filterPeriod$ = this.filterPeriodSubject.asObservable();
  sort$ = this.sortSubject.asObservable();
  currentPage$ = this.currentPageSubject.asObservable();

  constructor() {}

  updateSelectedSurvey(newSelectedSurvey: Survey | null): void {
    this.selectedSurveySubject.next(newSelectedSurvey);
  }

  selectFilterPeriod(selectedFilterPeriod: Period | null): void {
    this.filterPeriodSubject.next(selectedFilterPeriod);
  }

  setSort(sort: Sort): void {
    this.sortSubject.next(sort);
  }

  setCurrentPage(currentPage: number): void {
    this.currentPageSubject.next(currentPage);
  }
}
