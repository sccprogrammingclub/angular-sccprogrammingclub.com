import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SaraLComponent } from './sara-l.component';

describe('SaraLComponent', () => {
  let component: SaraLComponent;
  let fixture: ComponentFixture<SaraLComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SaraLComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SaraLComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
