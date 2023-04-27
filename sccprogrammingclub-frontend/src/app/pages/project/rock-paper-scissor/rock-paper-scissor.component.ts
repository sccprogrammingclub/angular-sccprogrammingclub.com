import { Component } from '@angular/core';
import { _countGroupLabelsBeforeOption } from '@angular/material/core';

@Component({
  selector: 'app-rock-paper-scissor',
  templateUrl: './rock-paper-scissor.component.html',
  styleUrls: ['./rock-paper-scissor.component.css']
})
export class RockPaperScissorComponent {
  
  scoreUser:number = 0;
  scoreComp:number = 0;

  choices:string[] = ["rock", "paper", "scissors"];
  compChoice:string = "";

start() {

}

  selectItem(choice:string) {
    switch(choice) {
      case 'rock':

      break;
      case 'paper':

      break;
      case 'scissors':

      break;
    }
  }

  nextRound() {
    
  }

  end() {

  }

}
