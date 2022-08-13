import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmilyBComponent } from './emily-b.component';

describe('EmilyBComponent', () => {
  let component: EmilyBComponent;
  let fixture: ComponentFixture<EmilyBComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ EmilyBComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmilyBComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
