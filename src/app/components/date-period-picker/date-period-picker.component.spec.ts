import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DatePeriodPickerComponent } from './date-period-picker.component';

describe('DatePeriodPickerComponent', () => {
  let component: DatePeriodPickerComponent;
  let fixture: ComponentFixture<DatePeriodPickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DatePeriodPickerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DatePeriodPickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});