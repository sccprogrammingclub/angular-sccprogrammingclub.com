import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JayDfComponent } from './jay-df.component';

describe('JayDfComponent', () => {
  let component: JayDfComponent;
  let fixture: ComponentFixture<JayDfComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ JayDfComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JayDfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
