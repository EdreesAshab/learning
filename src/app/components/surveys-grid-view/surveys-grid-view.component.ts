import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

import { Subscription } from 'rxjs';

import { Direction } from '@angular/cdk/bidi';

import { MatGridListModule } from '@angular/material/grid-list';

import { SurveyGridViewItemComponent } from '../survey-grid-view-item/survey-grid-view-item.component';

import { UiService } from '../../services/ui.service';

import { Survey } from '../../types';

@Component({
  selector: 'app-surveys-grid-view',
  standalone: true,
  imports: [CommonModule, MatGridListModule, SurveyGridViewItemComponent],
  templateUrl: './surveys-grid-view.component.html',
  styleUrl: './surveys-grid-view.component.css',
})
export class SurveysGridViewComponent {
  @Input() surveys: Survey[];

  selectedSurvey: Survey | null;

  gridDir: Direction;

  subscription: Subscription;

  constructor(private uiService: UiService) {}

  ngOnInit() {
    this.subscription = this.uiService.selectedSurvey$.subscribe(
      (newSelectedSurvey) => {
        this.selectedSurvey = newSelectedSurvey;
      }
    );

    this.subscription = this.uiService.language$.subscribe((language) => {
      if (language === 'Ar') this.gridDir = 'rtl';
      else this.gridDir = 'ltr';
    });
  }

  selectSurvey(survey: Survey): void {
    this.selectedSurvey = survey;
    this.uiService.updateSelectedSurvey(this.selectedSurvey);
  }

  isSelected(id: number): boolean {
    return (
      this.selectedSurvey !== null &&
      this.selectedSurvey !== undefined &&
      this.selectedSurvey.SRV_ID === id
    );
  }
}
