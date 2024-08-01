import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private darkThemeSubject = new BehaviorSubject<boolean>(false);
  darkTheme$ = this.darkThemeSubject.asObservable();

  isDarkTheme = false;

  constructor(private cookieService: CookieService) {
    if (!cookieService.get('darkMode')) cookieService.set('darkMode', 'false');
    else if (cookieService.get('darkMode') === 'true') this.isDarkTheme = true;
    else this.isDarkTheme = false;

    this.darkThemeSubject.next(this.isDarkTheme);
  }

  toggleDarkTheme(): void {
    this.isDarkTheme = !this.isDarkTheme;
    this.cookieService.set('darkMode', this.isDarkTheme.toString());
    this.darkThemeSubject.next(this.isDarkTheme);
  }
}
