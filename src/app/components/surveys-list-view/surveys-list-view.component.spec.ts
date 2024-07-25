import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SurveysListViewComponent } from './surveys-list-view.component';

describe('SurveysListViewComponent', () => {
  let component: SurveysListViewComponent;
  let fixture: ComponentFixture<SurveysListViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SurveysListViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SurveysListViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
