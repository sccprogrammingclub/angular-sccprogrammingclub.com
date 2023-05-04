import { Component, OnInit, ElementRef } from '@angular/core';
import { GameLogicService } from '../game-logic.service';

@Component({
  selector: 'app-game-board',
  templateUrl: './game-board.component.html',
  styleUrls: ['./game-board.component.css'],
})
export class GameBoardComponent implements OnInit {
  constructor(private gameLogicService: GameLogicService, private el: ElementRef) {}

  ngOnInit(): void {
    this.gameLogicService.setGame(this.el.nativeElement);
  }
}