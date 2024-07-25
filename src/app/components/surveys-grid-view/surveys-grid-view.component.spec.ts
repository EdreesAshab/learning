import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SurveysGridViewComponent } from './surveys-grid-view.component';

describe('SurveysGridViewComponent', () => {
  let component: SurveysGridViewComponent;
  let fixture: ComponentFixture<SurveysGridViewComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SurveysGridViewComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SurveysGridViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
