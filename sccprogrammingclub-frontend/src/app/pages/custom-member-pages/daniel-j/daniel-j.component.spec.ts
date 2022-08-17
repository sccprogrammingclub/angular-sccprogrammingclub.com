import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DanielJComponent } from './daniel-j.component';

describe('DanielJComponent', () => {
  let component: DanielJComponent;
  let fixture: ComponentFixture<DanielJComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DanielJComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DanielJComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
