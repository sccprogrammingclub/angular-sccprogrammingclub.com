import { Injectable, ElementRef } from '@angular/core'

@Injectable({
  providedIn: 'root',
})
export class GameLogicService {
  private playerRed = 'R'
  private playerYellow = 'Y'
  private currPlayer = this.playerRed

  private gameOver = false
  private board: any;
  private currColumns:any;

  private rows = 6
  private columns = 7
  private turnsLeft = this.rows * this.columns

  setGame(el: ElementRef): void {
    this.board = []
    this.currColumns = [5, 5, 5, 5, 5, 5, 5]
    const winnerElement = el.nativeElement.querySelector('#winner')
    winnerElement.innerHTML =
      'Local Players Only <br> <span class="red-text">\nRed</span> Starts'

    for (let r = 0; r < this.rows; r++) {
      let row = []
      for (let c = 0; c < this.columns; c++) {
        row.push(' ')

        let tile = document.createElement('div')
        tile.id = r.toString() + '-' + c.toString()
        tile.classList.add('tile')
        tile.addEventListener('click', () => this.setPiece(r, c, el))
        el.nativeElement.querySelector('#board').append(tile)
      }
      this.board.push(row)
    }
  }

  setPiece(r: number, c: number, el: ElementRef): void {
    if (this.gameOver) {
      return
    }

    r = this.currColumns[c]
    if (r < 0) {
      return
    }

    this.board[r][c] = this.currPlayer
    let tile = el.nativeElement.querySelector(
      '#' + r.toString() + '-' + c.toString(),
    )
    let player = el.nativeElement.querySelector('#winner')
    if (this.currPlayer == this.playerRed) {
      tile.classList.add('red-piece')
      this.currPlayer = this.playerYellow
      player.innerHTML = '<span class="yellow-text">Yellow\'s</span> Turn'
    } else {
      tile.classList.add('yellow-piece')
      this.currPlayer = this.playerRed
      player.innerHTML = '<span class="red-text">Red\'s</span> Turn'
    }

    r -= 1
    this.currColumns[c] = r
    this.turnsLeft -= 1
    this.checkWinner(el)
  }

  private checkWinner(el: ElementRef): void {
    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.columns - 3; c++) {
        if (this.board[r][c] !== ' ') {
          if (
            this.board[r][c] === this.board[r][c + 1] &&
            this.board[r][c + 1] === this.board[r][c + 2] &&
            this.board[r][c + 2] === this.board[r][c + 3]
          ) {
            this.setBorder(r, c, el)
            this.setBorder(r, c + 1, el)
            this.setBorder(r, c + 2, el)
            this.setBorder(r, c + 3, el)

            this.setWinner(r, c, el)
            return
          }
        }
      }
    }

    for (let c = 0; c < this.columns; c++) {
      for (let r = 0; r < this.rows - 3; r++) {
        if (this.board[r][c] !== ' ') {
          if (
            this.board[r][c] === this.board[r + 1][c] &&
            this.board[r + 1][c] === this.board[r + 2][c] &&
            this.board[r + 2][c] === this.board[r + 3][c]
          ) {
            this.setBorder(r, c, el)
            this.setBorder(r + 1, c, el)
            this.setBorder(r + 2, c, el)
            this.setBorder(r + 3, c, el)

            this.setWinner(r, c, el)
            return
          }
        }
      }
    }

    for (let r = 0; r < this.rows - 3; r++) {
      for (let c = 0; c < this.columns - 3; c++) {
        if (this.board[r][c] !== ' ') {
          if (
            this.board[r][c] === this.board[r + 1][c + 1] &&
            this.board[r + 1][c + 1] === this.board[r + 2][c + 2] &&
            this.board[r + 2][c + 2] === this.board[r + 3][c + 3]
          ) {
            this.setBorder(r, c, el)
            this.setBorder(r + 1, c + 1, el)
            this.setBorder(r + 2, c + 2, el)
            this.setBorder(r + 3, c + 3, el)

            this.setWinner(r, c, el)
            return
          }
        }
      }
    }

    for (let r = 3; r < this.rows; r++) {
      for (let c = 0; c < this.columns - 3; c++) {
        if (this.board[r][c] !== ' ') {
          if (
            this.board[r][c] === this.board[r - 1][c + 1] &&
            this.board[r - 1][c + 1] === this.board[r - 2][c + 2] &&
            this.board[r - 2][c + 2] === this.board[r - 3][c + 3]
          ) {
            this.setBorder(r, c, el)
            this.setBorder(r - 1, c + 1, el)
            this.setBorder(r - 2, c + 2, el)
            this.setBorder(r - 3, c + 3, el)

            this.setWinner(r, c, el)
            return
          }
        }
      }
    }

    if (this.turnsLeft === 0) {
      this.draw(el)
    }
  }

  private setWinner(r: number, c: number, el: ElementRef): void {
    let winner = el.nativeElement.querySelector('#winner')
    if (this.board[r][c] == this.playerRed) {
      winner.innerHTML = '<span class="red-text">Red Wins!!</span>'
    } else {
      winner.innerHTML = '<span class="yellow-text">Yellow Wins!!</span>'
    }

    this.gameOver = true
  }

  private draw(el: ElementRef): void {
    el.nativeElement.querySelector('#winner').innerText = 'DRAW!!'
  }

  private setBorder(r: number, c: number, el: ElementRef): void {
    let tile = el.nativeElement.querySelector(
      '#' + r.toString() + '-' + c.toString(),
    )
    tile.classList.add('winner')
  }
}
