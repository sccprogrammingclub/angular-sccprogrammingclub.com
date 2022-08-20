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
  currentMembers: Member[] = [];

  constructor(private memberService: MemberService) {
    this.currentMembers = memberService.getCurrentMembers();
  }

  ngOnInit(): void {
  }

}
