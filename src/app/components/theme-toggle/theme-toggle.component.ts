import { Component, Inject, OnInit } from '@angular/core';
import { ThemeService } from '../../services/theme.service';
import { MatIcon } from '@angular/material/icon';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { DOCUMENT } from '@angular/common';

@Component({
  selector: 'app-theme-toggle',
  standalone: true,
  imports: [FormsModule, MatIcon, MatSlideToggleModule],
  templateUrl: './theme-toggle.component.html',
  styleUrl: './theme-toggle.component.css',
})
export class ThemeToggleComponent implements OnInit {
  isDarkTheme: boolean;

  subscription: Subscription;

  constructor(
    private themeService: ThemeService,
    @Inject(DOCUMENT) private doc: Document
  ) {}

  ngOnInit() {
    this.subscription = this.themeService.darkTheme$.subscribe(
      (isDarkTheme) => {
        this.isDarkTheme = isDarkTheme;

        if (this.isDarkTheme) {
          this.doc.documentElement.classList.add('dark');
          this.doc.documentElement.classList.remove('light');

          this.doc.body.classList.add('dark');
          this.doc.body.classList.remove('light');
        } else {
          this.doc.documentElement.classList.add('light');
          this.doc.documentElement.classList.remove('dark');

          this.doc.body.classList.add('light');
          this.doc.body.classList.remove('dark');
        }
      }
    );
  }

  toggleTheme() {
    this.themeService.toggleDarkTheme();
  }
}
