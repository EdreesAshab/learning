import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

import { MatGridListModule } from '@angular/material/grid-list';

import { SurveyGridViewItemComponent } from '../survey-grid-view-item/survey-grid-view-item.component';
import { Survey } from '../../types';
import { UiService } from '../../services/ui.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-surveys-grid-view',
  standalone: true,
  imports: [CommonModule, MatGridListModule, SurveyGridViewItemComponent],
  templateUrl: './surveys-grid-view.component.html',
  styleUrl: './surveys-grid-view.component.css',
})
export class SurveysGridViewComponent {
  @Input() surveys: Survey[];
  @Output() selectSurveyEvent: EventEmitter<Survey> =
    new EventEmitter<Survey>();

  selectedSurvey: Survey | null;

  subscription: Subscription;

  constructor(private uiService: UiService) {}

  ngOnInit() {
    this.subscription = this.uiService.value$.subscribe((newSelectedSurvey) => {
      this.selectedSurvey = newSelectedSurvey;
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
