import { ChangeDetectorRef, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatDividerModule } from '@angular/material/divider';

import { InitialCircleComponent } from '../initial-circle/initial-circle.component';
import { UiService } from '../../services/ui.service';
import { LanguagePipe } from '../../pipes/language.pipe';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [
    RouterLink,
    MatIconModule,
    MatButtonModule,
    MatToolbarModule,
    MatDividerModule,
    InitialCircleComponent,
    LanguagePipe,
  ],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  name: string = 'Edrees Ashab';
  language: string = 'Ar';

  subscription: Subscription;

  constructor(private uiService: UiService) {}

  ngOnInit() {
    this.subscription = this.uiService.language$.subscribe((language) => {
      this.language = language;
    });
  }

  toggleLanguage() {
    this.uiService.toggleLanguage();
  }
}
