import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Survey } from '../types';

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

  getData(): Observable<Survey[]> {
    return this.http.get<Survey[]>(this.dataUrl);
  }

  updateItem(updatedSurvey: Survey): Observable<Survey> {
    return this.http.put<any>(
      `${this.dataUrl}/${updatedSurvey.SRV_ID}`,
      updatedSurvey,
      httpOptions
    );
  }
}
