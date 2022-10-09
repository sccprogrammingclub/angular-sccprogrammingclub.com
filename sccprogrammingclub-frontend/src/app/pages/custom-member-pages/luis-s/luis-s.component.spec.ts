import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LuisSComponent } from './luis-s.component';

describe('LuisSComponent', () => {
  let component: LuisSComponent;
  let fixture: ComponentFixture<LuisSComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LuisSComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(LuisSComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
