import { Component, Input } from '@angular/core';

import { Subscription } from 'rxjs';

import { UiService } from '../../services/ui.service';

@Component({
  selector: 'app-initial-circle',
  standalone: true,
  imports: [],
  templateUrl: './initial-circle.component.html',
  styleUrl: './initial-circle.component.css',
})
export class InitialCircleComponent {
  @Input() name: string;
  initials: string;

  subscription: Subscription;

  language: string = 'Ar';

  constructor(private uiService: UiService) {}

  ngOnInit() {
    this.subscription = this.uiService.language$.subscribe((language) => {
      this.language = language;
    });

    let str = this.name.split(' ');
    this.initials =
      this.name.charAt(0).toUpperCase() +
      str[str.length - 1].charAt(0).toUpperCase();
  }
}
