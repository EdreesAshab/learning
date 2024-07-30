import { Component, Inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DOCUMENT } from '@angular/common';

import { Subscription } from 'rxjs';

import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDividerModule } from '@angular/material/divider';

import { UiService } from '../../services/ui.service';
import { UsersService } from '../../services/users.service';

import { LanguagePipe } from '../../pipes/language.pipe';

import { InitialsCircleDirective } from '../../directives/initials-circle.directive';

import { User } from '../../models/User.model';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    RouterLink,
    MatIconModule,
    MatButtonModule,
    MatToolbarModule,
    MatDividerModule,
    LanguagePipe,
    InitialsCircleDirective,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  currentUser: User;

  language: string;

  subscription: Subscription;

  textSizeBtn: string;

  name: string;

  constructor(
    private uiService: UiService,
    private usersService: UsersService,
    @Inject(DOCUMENT) private document: Document
  ) {}

  ngOnInit() {
    this.subscription = this.uiService.textSize$.subscribe((textSize) => {
      if (textSize === 1) {
        this.textSizeBtn = 'Large Text';
        this.document.documentElement.style.fontSize = '16px';
      } else {
        this.textSizeBtn = 'Normal Text';
        this.document.documentElement.style.fontSize = '24px';
      }
    });

    this.subscription = this.usersService.currentUser$.subscribe(
      (currentUser) => {
        this.currentUser = currentUser;
      }
    );

    this.subscription = this.uiService.language$.subscribe((language) => {
      this.language = language;

      this.name =
        this.language === 'Ar'
          ? this.currentUser.nameAr
          : this.currentUser.nameEn;
    });
  }

  toggleLanguage() {
    this.uiService.toggleLanguage();
  }

  toggleTextSize() {
    this.uiService.toggleTextSize();
  }
}
