import { Component, Input, OnInit } from '@angular/core';
import { Member } from 'src/app/interfaces/member.interface';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.css']
})
export class CardComponent implements OnInit {

  @Input()
  member?: Member;

  constructor() { }

  ngOnInit(): void {
  }

}
