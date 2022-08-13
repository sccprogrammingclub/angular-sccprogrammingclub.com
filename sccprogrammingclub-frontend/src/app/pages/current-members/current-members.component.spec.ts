import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CurrentMembersComponent } from './current-members.component';

describe('CurrentMembersComponent', () => {
  let component: CurrentMembersComponent;
  let fixture: ComponentFixture<CurrentMembersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CurrentMembersComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CurrentMembersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
