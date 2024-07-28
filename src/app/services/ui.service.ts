import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { Period, Survey } from '../types';
import { Sort } from '@angular/material/sort';

@Injectable({
  providedIn: 'root',
})
export class UiService {
  private selectedSurveySubject = new BehaviorSubject<Survey | null>(null);
  private filterPeriodSubject = new BehaviorSubject<Period | null>(null);
  private sortSubject = new BehaviorSubject<Sort | null>(null);

  selectedSurvey$ = this.selectedSurveySubject.asObservable();
  filterPeriod$ = this.filterPeriodSubject.asObservable();
  sort$ = this.sortSubject.asObservable();

  constructor() {}

  updateSelectedSurvey(newSelectedSurvey: Survey | null) {
    this.selectedSurveySubject.next(newSelectedSurvey);
  }

  selectFilterPeriod(selectedFilterPeriod: Period | null) {
    this.filterPeriodSubject.next(selectedFilterPeriod);
  }

  setSort(sort: Sort) {
    this.sortSubject.next(sort);
  }
}
