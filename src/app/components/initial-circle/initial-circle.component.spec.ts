import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InitialCircleComponent } from './initial-circle.component';

describe('InitialCircleComponent', () => {
  let component: InitialCircleComponent;
  let fixture: ComponentFixture<InitialCircleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InitialCircleComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(InitialCircleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
