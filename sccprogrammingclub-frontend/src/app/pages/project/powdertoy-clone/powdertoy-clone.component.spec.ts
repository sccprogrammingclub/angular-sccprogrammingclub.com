import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PowdertoyCloneComponent } from './powdertoy-clone.component';

describe('PowdertoyCloneComponent', () => {
  let component: PowdertoyCloneComponent;
  let fixture: ComponentFixture<PowdertoyCloneComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PowdertoyCloneComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PowdertoyCloneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
