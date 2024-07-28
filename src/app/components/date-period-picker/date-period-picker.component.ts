import { JsonPipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { provideNativeDateAdapter } from '@angular/material/core';
import {
  MatCalendarCellClassFunction,
  MatDatepickerModule,
} from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Subscription } from 'rxjs';
import { UiService } from '../../services/ui.service';
import { Period } from '../../types';

@Component({
  selector: 'app-date-period-picker',
  standalone: true,
  providers: [provideNativeDateAdapter()],
  imports: [
    MatFormFieldModule,
    MatDatepickerModule,
    FormsModule,
    ReactiveFormsModule,
    JsonPipe,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './date-period-picker.component.html',
  styleUrl: './date-period-picker.component.css',
})
export class DatePeriodPickerComponent {
  readonly range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });

  dateForm: FormGroup;

  @Input() surveysPeriods: Period[] = [];

  constructor(private uiService: UiService) {}

  ngOnInit() {}

  clearPeriodFilter(): void {
    this.range.get('start')?.reset();
    this.range.get('end')?.reset();

    this.uiService.selectFilterPeriod(null);
  }

  applyPeriodFilter(): void {
    if (!this.range.value.start || !this.range.value.end) {
      this.clearPeriodFilter();
      return;
    }

    this.uiService.selectFilterPeriod({
      START_DATE: this.adjustTime(this.range.value.start),
      END_DATE: this.adjustTime(this.range.value.end),
    });
  }

  adjustTime(date: Date): string {
    date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
    return date.toISOString();
  }

  dateClass: MatCalendarCellClassFunction<Date> = (cellDate, view) => {
    if (view === 'month') {
      const dateString = this.adjustTime(cellDate).split('T')[0];
      const highlightedDatesString = this.surveysPeriods.map((period) => {
        return period.START_DATE.split('T')[0];
      });

      return highlightedDatesString.includes(dateString)
        ? 'highlightStartPeriod'
        : '';
    }

    return '';
  };
}
