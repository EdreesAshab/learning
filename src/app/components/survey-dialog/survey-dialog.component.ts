import {
  ChangeDetectionStrategy,
  Component,
  inject,
  model,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Survey } from '../../types';

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
  ],
  templateUrl: './survey-dialog.component.html',
  styleUrl: './survey-dialog.component.css',
})
export class SurveyDialogComponent {
  readonly dialogRef = inject(MatDialogRef<SurveyDialogComponent>);
  readonly data = inject<Survey>(MAT_DIALOG_DATA);
  readonly SurveyName = model(this.data.SurveyName);

  onNoClick(): void {
    this.dialogRef.close();
  }
}