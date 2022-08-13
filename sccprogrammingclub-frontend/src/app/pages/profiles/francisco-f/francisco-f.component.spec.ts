import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FranciscoFComponent } from './francisco-f.component';

describe('FranciscoFComponent', () => {
  let component: FranciscoFComponent;
  let fixture: ComponentFixture<FranciscoFComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ FranciscoFComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FranciscoFComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
