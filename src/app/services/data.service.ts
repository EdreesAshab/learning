import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs';

import { type Survey } from '../models/Survey.model';

const httpOptions = {
  headers: new HttpHeaders({
    'Content-Type': 'application/json',
  }),
};

@Injectable({
  providedIn: 'root',
})
export class DataService {
  private dataUrl = 'http://localhost:3000/surveys';
  constructor(private http: HttpClient) {}

  getSurveys(): Observable<Survey[]> {
    return this.http.get<Survey[]>(this.dataUrl);
  }

  updateSurveyName(updatedSurvey: Survey): Observable<Survey> {
    return this.http.put<any>(
      `${this.dataUrl}/${updatedSurvey.SRV_ID}`,
      updatedSurvey,
      httpOptions
    );
  }
}
