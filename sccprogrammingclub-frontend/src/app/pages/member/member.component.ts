import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Member } from 'src/app/interfaces/member.interface';
import { MemberService } from 'src/app/services/member/member.service';

@Component({
  selector: 'app-member',
  templateUrl: './member.component.html',
  styleUrls: ['./member.component.css']
})
export class MemberComponent implements OnInit {

  username: any;
  member?: Member;

  constructor(private route: ActivatedRoute, private memberService: MemberService) {
  }

  ngOnInit(): void {
    this.member = this.memberService.getMember(this.route.snapshot.params['username']);
  }

}
