import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoaSComponent } from './noa-s.component';

describe('NoaSComponent', () => {
  let component: NoaSComponent;
  let fixture: ComponentFixture<NoaSComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NoaSComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NoaSComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
