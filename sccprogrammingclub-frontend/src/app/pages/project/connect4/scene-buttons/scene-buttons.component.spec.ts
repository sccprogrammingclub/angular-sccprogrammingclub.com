import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SceneButtonsComponent } from './scene-buttons.component';

describe('SceneButtonsComponent', () => {
  let component: SceneButtonsComponent;
  let fixture: ComponentFixture<SceneButtonsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SceneButtonsComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SceneButtonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
