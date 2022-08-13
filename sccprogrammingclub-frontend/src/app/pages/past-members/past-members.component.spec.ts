import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PastMembersComponent } from './past-members.component';

describe('PastMembersComponent', () => {
  let component: PastMembersComponent;
  let fixture: ComponentFixture<PastMembersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PastMembersComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PastMembersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
