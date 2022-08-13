import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TedMComponent } from './ted-m.component';

describe('TedMComponent', () => {
  let component: TedMComponent;
  let fixture: ComponentFixture<TedMComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TedMComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TedMComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
