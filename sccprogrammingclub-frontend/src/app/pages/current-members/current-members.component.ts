import { Component, OnInit } from '@angular/core';
import { Member } from 'src/app/interfaces/member.interface';
import { MemberService } from 'src/app/services/member/member.service';

@Component({
  selector: 'app-current-members',
  templateUrl: './current-members.component.html',
  styleUrls: ['./current-members.component.css']
})
export class CurrentMembersComponent implements OnInit {

  currentYear: string = '2021-2022';
  currentMembers: Member[] = [{
    name: 'Fran',
    username: 'francisco-f',
    title: 'President',
    desc: 'The code is great.',
    bio: 'Fran\'s bioooo.',
    img: 'https://media.istockphoto.com/vectors/cute-kawaii-beautiful-face-smile-and-happy-vector-id695343600'
  }, {
    name: 'Dan',
    username: 'daniel-j',
    title: 'VP',
    desc: 'Coding is so much fun',
    bio: 'I just love to code.',
    img: 'https://media.istockphoto.com/vectors/cute-kawaii-beautiful-face-smile-and-happy-vector-id695343600'
  },
  {
    name: 'Sara',
    username: 'sara-l',
    title: 'Member',
    desc: 'My name is Sara! :D',
    bio: 'My life is so adventurous!',
    img: 'https://media.istockphoto.com/vectors/cute-kawaii-beautiful-face-smile-and-happy-vector-id695343600'
  }];

  constructor() {
  }

  ngOnInit(): void {
  }

}
