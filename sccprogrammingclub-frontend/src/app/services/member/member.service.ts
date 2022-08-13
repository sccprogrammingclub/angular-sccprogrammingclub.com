import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { of } from 'rxjs';
import { Member } from 'src/app/interfaces/member.interface';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MemberService {

  private currentMembers?: Member[];
  private pastMembers?: Member[];
  private member?: Member;

  constructor(private http: HttpClient) { }

  getCurrentMembers() {
    if (this.currentMembers) {
      return of(this.currentMembers);
    } else {
      return this.http.get<Member>(`${environment.url}/api/members/get-current-members`);
    }
  }

  getPastMembers() {
    if (this.pastMembers) {
      return of(this.pastMembers);
    } else {
      return this.http.get<Member>(`${environment.url}/api/members/get-past-members`);
    }
  }

  getMember(id: string) {
    if (this.member) {
      return of(this.member);
    } else {
      return this.http.get<Member>(`${environment.url}/api/members/get-one`);
    }
  }

}
