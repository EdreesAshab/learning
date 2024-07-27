import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SurveyGridViewItemComponent } from './survey-grid-view-item.component';

describe('SurveyGridViewItemComponent', () => {
  let component: SurveyGridViewItemComponent;
  let fixture: ComponentFixture<SurveyGridViewItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SurveyGridViewItemComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SurveyGridViewItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
