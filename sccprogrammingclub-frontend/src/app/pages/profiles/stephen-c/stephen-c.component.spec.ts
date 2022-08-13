import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StephenCComponent } from './stephen-c.component';

describe('StephenCComponent', () => {
  let component: StephenCComponent;
  let fixture: ComponentFixture<StephenCComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ StephenCComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(StephenCComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
