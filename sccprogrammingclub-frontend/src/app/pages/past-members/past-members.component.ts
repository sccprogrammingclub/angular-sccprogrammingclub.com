import { Component, OnInit } from '@angular/core';
import { Member } from 'src/app/interfaces/member.interface';
import { MemberService } from 'src/app/services/member/member.service';

@Component({
  selector: 'app-past-members',
  templateUrl: './past-members.component.html',
  styleUrls: ['./past-members.component.css']
})
export class PastMembersComponent implements OnInit {

  // pastMembers: Member[] = [];

  constructor() {
    // memberService.getPastMembers().subscribe((pastMembers) => {
    //   this.pastMembers = pastMembers;
    // });
  }

  ngOnInit(): void {
  }

}
