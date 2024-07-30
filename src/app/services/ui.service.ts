import { Inject, Injectable } from '@angular/core';
import { DOCUMENT } from '@angular/common';

import { BehaviorSubject } from 'rxjs';

import { CookieService } from 'ngx-cookie-service';
import { ToastrService } from 'ngx-toastr';

import { Sort } from '@angular/material/sort';

import { Period } from '../models/Period.model';
import { Survey } from '../models/Survey.model';

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
  htmlTag: HTMLHtmlElement;

  constructor(
    private cookieService: CookieService,
    private toastr: ToastrService,
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

    this.htmlTag = this.document.getElementsByTagName(
      'html'
    )[0] as HTMLHtmlElement;

    this.htmlTag.dir = this.currentLanguage === 'Ar' ? 'rtl' : 'ltr';
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
    if (this.currentLanguage === 'Ar') {
      this.toastr.success(
        'تم ضبط اللغة إلى اللغة الإنجليزية\nLanguage has been set to English'
      );
      this.currentLanguage = 'En';
    } else {
      this.toastr.success(
        'تم ضبط اللغة إلى العربية\nLanguage has been set to Arabic'
      );
      this.currentLanguage = 'Ar';
    }
    this.cookieService.set('language', this.currentLanguage);

    this.htmlTag.dir = this.currentLanguage === 'Ar' ? 'rtl' : 'ltr';

    this.languageSubject.next(this.currentLanguage);
  }

  toggleTextSize(): void {
    if (this.currentTextSize === 1) {
      this.currentTextSize = 2;
      if (this.currentLanguage === 'Ar')
        this.toastr.success('تم ضبط حجم النص إلى كبير');
      else this.toastr.success('Text size has been set to large');
    } else {
      this.currentTextSize = 1;
      if (this.currentLanguage === 'Ar')
        this.toastr.success('تم ضبط حجم النص إلى الوضع الطبيعي');
      else this.toastr.success('Text size has been set to normal');
    }
    this.cookieService.set('textSize', this.currentTextSize.toString());
    this.textSizeSubject.next(this.currentTextSize);
  }
}
