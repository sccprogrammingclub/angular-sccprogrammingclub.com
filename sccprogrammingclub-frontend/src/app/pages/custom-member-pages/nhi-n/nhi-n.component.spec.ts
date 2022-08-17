import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NhiNComponent } from './nhi-n.component';

describe('NhiNComponent', () => {
  let component: NhiNComponent;
  let fixture: ComponentFixture<NhiNComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NhiNComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NhiNComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
