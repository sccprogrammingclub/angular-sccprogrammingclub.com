import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExampleProjectComponent } from './example-project.component';

describe('ExampleProjectComponent', () => {
  let component: ExampleProjectComponent;
  let fixture: ComponentFixture<ExampleProjectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ExampleProjectComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExampleProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
