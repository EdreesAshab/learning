import { Component, inject, model } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { Subscription } from 'rxjs';

import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

import { UiService } from '../../services/ui.service';

import { LanguagePipe } from '../../pipes/language.pipe';

import { Survey } from '../../models/Survey.model';

@Component({
  selector: 'app-survey-dialog',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions,
    MatDialogClose,
    LanguagePipe,
  ],
  templateUrl: './survey-dialog.component.html',
  styleUrl: './survey-dialog.component.css',
})
export class SurveyDialogComponent {
  readonly dialogRef = inject(MatDialogRef<SurveyDialogComponent>);
  readonly data = inject<Survey>(MAT_DIALOG_DATA);
  readonly SurveyNameAr = model(this.data.SurveyNameAr);
  readonly SurveyNameEn = model(this.data.SurveyNameEn);
  readonly SurveyName = model({
    Ar: this.SurveyNameAr,
    En: this.SurveyNameEn,
  });

  language: string;

  subscription: Subscription;

  constructor(private uiService: UiService) {}

  ngOnInit() {
    this.subscription = this.uiService.language$.subscribe((language) => {
      this.language = language;
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
