import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-current-members',
  templateUrl: './current-members.component.html',
  styleUrls: ['./current-members.component.css']
})
export class CurrentMembersComponent implements OnInit {

  // currentMembers: Member[] = [];

  constructor() {
    // memberService.getCurrentMembers().subscribe((currentMembers) => {
    //   this.currentMembers = currentMembers;
    // });
  }

  ngOnInit(): void {
  }

}
