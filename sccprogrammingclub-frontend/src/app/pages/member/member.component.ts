import { Component, Input, OnInit } from '@angular/core';
import { Route, Router } from '@angular/router';
import { Member } from 'src/app/interfaces/member.interface';

@Component({
  selector: 'app-member',
  templateUrl: './member.component.html',
  styleUrls: ['./member.component.css']
})
export class MemberComponent implements OnInit {

  @Input()
  member?: Member = {
    "name": "Francisco Fonseca",
    "username": "franfonse",
    "title": "President",
    "intro": "We've got work to do.",
    "bio": "Hi, my name is Francisco Fonseca. I'm the current President of the Programming Club. I'm studying Computer Engineering, with an inclination to software development. Check my website to get to know more about me!",
    "img": "https://s3.us-west-2.amazonaws.com/sccprogrammingclub.com/member-photos/FranciscoFonseca.jpeg"
  };

  constructor(private route: Router) {
    route.url;
  }

  ngOnInit(): void {
  }

}
