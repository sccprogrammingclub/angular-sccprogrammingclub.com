import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatgptTicTacToeComponent } from './chatgpt-tic-tac-toe.component';

describe('ChatgptTicTacToeComponent', () => {
  let component: ChatgptTicTacToeComponent;
  let fixture: ComponentFixture<ChatgptTicTacToeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChatgptTicTacToeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChatgptTicTacToeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
