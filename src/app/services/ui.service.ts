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
  private languageSubject = new BehaviorSubject<string>('Ar');

  selectedSurvey$ = this.selectedSurveySubject.asObservable();
  filterPeriod$ = this.filterPeriodSubject.asObservable();
  sort$ = this.sortSubject.asObservable();
  currentPage$ = this.currentPageSubject.asObservable();
  language$ = this.languageSubject.asObservable();

  currentLanguage: string = 'Ar';

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

  toggleLanguage(): void {
    if (this.currentLanguage === 'Ar') this.currentLanguage = 'En';
    else this.currentLanguage = 'Ar';
    this.languageSubject.next(this.currentLanguage);
  }
}
