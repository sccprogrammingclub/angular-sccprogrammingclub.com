import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SnakeProjectComponent } from './snake-project.component';

describe('Cod3dProjectComponent', () => {
  let component: SnakeProjectComponent;
  let fixture: ComponentFixture<SnakeProjectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SnakeProjectComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SnakeProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
