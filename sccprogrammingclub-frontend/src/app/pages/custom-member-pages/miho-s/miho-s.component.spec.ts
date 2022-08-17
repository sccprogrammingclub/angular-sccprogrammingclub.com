import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MihoSComponent } from './miho-s.component';

describe('MihoSComponent', () => {
  let component: MihoSComponent;
  let fixture: ComponentFixture<MihoSComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MihoSComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MihoSComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
