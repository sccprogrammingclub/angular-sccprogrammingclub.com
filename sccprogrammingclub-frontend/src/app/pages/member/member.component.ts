import { Component, Input, OnInit } from '@angular/core';
import { Member } from 'src/app/interfaces/member.interface';

@Component({
  selector: 'app-member',
  templateUrl: './member.component.html',
  styleUrls: ['./member.component.css']
})
export class MemberComponent implements OnInit {

  @Input()
  member?: Member;

  constructor() {
  }

  ngOnInit(): void {
  }

}
