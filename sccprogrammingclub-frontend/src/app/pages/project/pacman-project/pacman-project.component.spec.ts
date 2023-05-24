import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PacmanProjectComponent } from './pacman-project.component';

describe('PacmanProjectComponent', () => {
  let component: PacmanProjectComponent;
  let fixture: ComponentFixture<PacmanProjectComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PacmanProjectComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PacmanProjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
