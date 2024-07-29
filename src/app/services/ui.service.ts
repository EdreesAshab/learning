import { Inject, Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs';

import { CookieService } from 'ngx-cookie-service';

import { Sort } from '@angular/material/sort';

import { Period, Survey } from '../types';
import { DOCUMENT } from '@angular/common';

@Injectable({
  providedIn: 'root',
})
export class UiService {
  private selectedSurveySubject = new BehaviorSubject<Survey | null>(null);
  private filterPeriodSubject = new BehaviorSubject<Period | null>(null);
  private sortSubject = new BehaviorSubject<Sort | null>(null);
  private currentPageSubject = new BehaviorSubject<number>(0);
  private languageSubject = new BehaviorSubject<string>('Ar');
  private textSizeSubject = new BehaviorSubject<number>(1);

  selectedSurvey$ = this.selectedSurveySubject.asObservable();
  filterPeriod$ = this.filterPeriodSubject.asObservable();
  sort$ = this.sortSubject.asObservable();
  currentPage$ = this.currentPageSubject.asObservable();

  language$ = this.languageSubject.asObservable();
  textSize$ = this.textSizeSubject.asObservable();

  currentLanguage: string;
  currentTextSize: number;

  constructor(
    private cookieService: CookieService,
    @Inject(DOCUMENT) private document: Document
  ) {
    if (cookieService.get('language') === '')
      cookieService.set('language', 'Ar');
    else {
      this.currentLanguage = cookieService.get('language');
      this.languageSubject.next(this.currentLanguage);
    }

    if (cookieService.get('textSize') === '')
      cookieService.set('textSize', '1');
    else {
      this.currentTextSize = Number(cookieService.get('textSize'));
      this.textSizeSubject.next(this.currentTextSize);
    }
  }

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
    this.cookieService.set('language', this.currentLanguage);

    const htmlTag = this.document.getElementsByTagName(
      'html'
    )[0] as HTMLHtmlElement;
    htmlTag.dir = this.currentLanguage === 'Ar' ? 'rtl' : 'ltr';

    this.languageSubject.next(this.currentLanguage);
  }

  toggleTextSize(): void {
    if (this.currentTextSize === 1) this.currentTextSize = 2;
    else this.currentTextSize = 1;
    this.cookieService.set('textSize', this.currentTextSize.toString());
    this.textSizeSubject.next(this.currentTextSize);
  }
}
