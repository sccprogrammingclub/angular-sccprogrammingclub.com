import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RisaOComponent } from './risa-o.component';

describe('RisaOComponent', () => {
  let component: RisaOComponent;
  let fixture: ComponentFixture<RisaOComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RisaOComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RisaOComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
