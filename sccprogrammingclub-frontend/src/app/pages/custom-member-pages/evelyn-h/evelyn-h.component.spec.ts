import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EvelynHComponent } from './evelyn-h.component';

describe('EvelynHComponent', () => {
  let component: EvelynHComponent;
  let fixture: ComponentFixture<EvelynHComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EvelynHComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EvelynHComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
