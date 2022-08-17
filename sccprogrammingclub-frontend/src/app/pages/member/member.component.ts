import { Component, Input, OnInit } from '@angular/core';
import { Member } from 'src/app/interfaces/member.interface';

@Component({
  selector: 'app-member',
  templateUrl: './member.component.html',
  styleUrls: ['./member.component.css']
})
export class MemberComponent implements OnInit {

  @Input()
  member: Member = {
    name: 'Fran',
    username: 'francisco-f',
    title: 'President',
    desc: 'The code is great.',
    bio: 'Fran\'s bioooo.',
    img: 'https://media.istockphoto.com/vectors/cute-kawaii-beautiful-face-smile-and-happy-vector-id695343600'
  };

  constructor() { }

  ngOnInit(): void {
  }

}
