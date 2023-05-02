import { Component } from '@angular/core';

@Component({
  selector: 'app-tic-tac-toe',
  templateUrl: './chatgpt-tic-tac-toe.component.html',
  styleUrls: ['./chatgpt-tic-tac-toe.component.css']
})
export class ChatgptTicTacToeComponent {

  board = [' ', ' ', ' ', ' ', ' ', ' ', ' ', ' ', ' '];
  player = 'X';
  winner:any = null;

  play(idx: number) {
    if (this.board[idx] !== ' ' || this.winner) {
      return;
    }

    this.board[idx] = this.player;

    if (this.checkForWinner()) {
      this.winner = this.player;
    }

    this.player = this.player === 'X' ? 'O' : 'X';
  }

  checkForWinner(): boolean {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6]
    ];

    for (const [a, b, c] of lines) {
      if (this.board[a] !== ' ' && this.board[a] === this.board[b] && this.board[b] === this.board[c]) {
        return true;
      }
    }

    return false;
  }

}
