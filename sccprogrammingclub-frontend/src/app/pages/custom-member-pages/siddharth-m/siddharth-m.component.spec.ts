import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SiddharthMComponent } from './siddharth-m.component';

describe('SiddharthMComponent', () => {
  let component: SiddharthMComponent;
  let fixture: ComponentFixture<SiddharthMComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SiddharthMComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SiddharthMComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
