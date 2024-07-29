import { Component, Input } from '@angular/core';

import { Subscription } from 'rxjs';

import { UiService } from '../../services/ui.service';
import { User } from '../../types';

@Component({
  selector: 'app-initial-circle',
  standalone: true,
  imports: [],
  templateUrl: './initial-circle.component.html',
  styleUrl: './initial-circle.component.css',
})
export class InitialCircleComponent {
  @Input() user: User;
  name: string;
  initials: string;

  subscription: Subscription;

  language: string;

  textSize: number;

  constructor(private uiService: UiService) {}

  ngOnInit() {
    this.subscription = this.uiService.language$.subscribe((language) => {
      this.language = language;
      this.name = this.user[`name${language}` as keyof Object].toString();
      this.getInitials();
    });

    this.subscription = this.uiService.textSize$.subscribe((textSize) => {
      this.textSize = textSize;
    });

    this.getInitials();
  }

  getInitials() {
    let str = this.name.split(' ');
    this.initials =
      this.name.charAt(0).toUpperCase() +
      str[str.length - 1].charAt(0).toUpperCase();
  }
}
