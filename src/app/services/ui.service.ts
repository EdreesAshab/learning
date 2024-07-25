import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { Survey } from '../types';

@Injectable({
  providedIn: 'root',
})
export class UiService {
  private subject = new BehaviorSubject<Survey | null>(null);

  value$ = this.subject.asObservable();

  constructor() {}

  updateSelectedSurvey(newSelectedSurvey: Survey | null) {
    this.subject.next(newSelectedSurvey);
  }

  getSelectedSurvey(): Observable<Survey | null> {
    return of(this.subject.getValue());
  }
}
