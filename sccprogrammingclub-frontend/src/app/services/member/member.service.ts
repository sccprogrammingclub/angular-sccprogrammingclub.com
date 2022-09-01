import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Member } from 'src/app/interfaces/member.interface';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class MemberService {

  private currentMembers: Member[] = [
    {
      "name": "Francisco Fonseca",
      "username": "franfonse",
      "title": "President",
      "intro": "We've got work to do.",
      "bio": "Hi, my name is Francisco Fonseca. I'm the current President of the Programming Club. I'm studying Computer Engineering, with an inclination to software development. Check my website to get to know more about me!",
      "img": "../../../assets/images/member-headshots/FranciscoFonseca.jpeg"
    },
    {
      "name": "Daniel Johnson",
      "username": "danieljohnson",
      "title": "Vice President",
      "intro": "This member hasn't entered an introduction",
      "bio": "I grew up in Kodiak, Alaska and started my computer science journey during the senior year of high school. I enrolled in an applied engineering class partnered with a program called “A World Bridge” which was also partnered with NASA Ames Research Center. During my year with the program I learned about JavaScript, Python, HTML, CSS, and Linux operating systems while working on various real-world projects. I was studying and working on projects after school for hours on end while my teacher, Mr. Seraphim, supervised me after school and enabled my learning and growth. I was enthralled by the program, experience, and significant growth in my skills as were the directors of the program. At the end of the year, they offered me a summer intern position for NASA Ames Research Center. I promptly accepted and started work on the NASA CitySmart WorldWise project.\nAfter interning with NASA Ames Research center, I headed off to college. At the University of Alaska Anchorage, I started off as a biology major, but I quickly realized my interest in Computer Science far outshined the former and changed my major accordingly. I have been studying Computer Science in school since my major change and moved to Seattle, Washington to continue my studies. I will complete an Associate of Science at Seattle Central College in the Spring of 2022 and move on to the University of Washington's Paul Allen School of Computer Science and Engineering in the Fall.\nIn addition to my studies, I have joined various clubs such as the Seattle Central's Programming Club and Rocket Club.",
      "img": "../../../assets/images/member-headshots/DanielJohnson.jpeg"
    },
    {
      "name": "Stephen Cushing",
      "username": "stephencushing",
      "title": "Member",
      "intro": "Sometimes I'm sad, so I decide to stop being sad and be awesome instead.",
      "bio": "This member hasn't updated the bio.",
      "img": "../../../assets/images/member-headshots/StephenCushing.jpg"
    },
    {
      "name": "Ted Miller",
      "username": "tedmiller",
      "title": "Member",
      "intro": "This member hasn't entered an introduction",
      "bio": "This member hasn't entered a bio.",
      "img": "../../../assets/images/member-headshots/TedMiller.jpeg"
    },
    {
      "name": "Nhi Nguyen",
      "username": "nhinguyen",
      "title": "Member",
      "intro": "This member hasn't entered an introduction",
      "bio": "This member hasn't entered a bio.",
      "img": "../../../assets/images/member-headshots/NhiNguyen.JPG"
    },
    {
      "name": "Miho Suzuki",
      "username": "mihosuzuki",
      "title": "Member",
      "intro": "This member hasn't entered an introduction",
      "bio": "Hello, welcome to my portal page! My name is Miho Suzuki.\nI'm an international student from Japan. I was a student of Japanese university, and my major was economic. However, I realized that my interest was not economics but computer programming. So I decided to come here and study computer science.\nAnd of course, I enjoy it!",
      "img": "../../../assets/images/member-headshots/MihoSuzuki.JPG"
    },
    {
      "name": "Evelyn Huang",
      "username": "evelynhuang",
      "title": "Member",
      "intro": "Hi world, I am Yanlin Huang",
      "bio": "Welcome to my very first web page! Here you will get to know me and my passion to the world. Let's check it out!\nI was born in Guangzhou, China in 2000. I moved to Seattle in 2019 and earned an associate degree in Engineering at South Seattle College in 2022. I will transfer to UW, seattle and persuit a bacherlar's degree in Computer Engineering in Fall 2022. I am currently working for Student Government and Tutoring Center at South Seattle College.\nMy Myers–Briggs Type is Debator (ENTP). My motto is Seize the day!. I am relatively optimistic. I believe that technology and social science can preserve our environment and humanity and make the world better. Therefore, I hope to earn a doctorate in science and research in human-centered technology.\nCS: Emotion AI, Brain-Computer Interface.\nPHYS: Optics, Quantum Mechanics.\nEVS: Sustainability, Energy Conservation, Noise Pollution.\nART: Digitial Graphics, UX Design\nSports: Basketball, Hiking, Running, Taekwondo\nTV shows: Rick and MortyEmail: snowevelyn666@gmail.com\nSocial Media: Instagram",
      "img": "../../../assets/images/member-headshots/EvelynHuang.jpg"
    },
    {
      "name": "Emily Brinks",
      "username": "emilybrinks",
      "title": "Member",
      "intro": "This member hasn't entered an introduction",
      "bio": "Currently a student in the Web Development program at Seattle Central Community College. I am interested in both front-end and back-end web development. I've harbored a few passions that inform these interests. Lifelong hobbies like photography, design, and experimenting with different mediums in art motivate my interest in front-end development while my infatuation with logic, puzzles, mathematics, data science, systems theory and statistics draw me to back-end development.\nPreviously I spent over 15 years working various positions within the restaurant industry, mostly in the front of the house as a bartender. My love of people, food and flavors kept me in restaurants but the pandemic combined with a preexisting urge to return to school brought me to this program.\nBeyond school and work and the aforementioned interests I also love music, foraging, growing food, studying foodways, history, social sciences, mycology, promoting community science and my beloved cats.",
      "img": "../../../assets/images/member-headshots/EmilyBrinks.jpg"
    },
    {
      "name": "Risa Ohtake",
      "username": "risaohtake",
      "title": "Member",
      "intro": "This member hasn't entered an introduction",
      "bio": "",
      "img": "../../../assets/images/member-headshots/Default.jpg"
    },
    {
      "name": "Sara Lee",
      "username": "saralee",
      "title": "Member",
      "intro": "This member hasn't entered an introduction",
      "bio": "",
      "img": "../../../assets/images/member-headshots/SooLee.jpg"
    },
    {
      "name": "Noa Shiga",
      "username": "noashiga",
      "title": "Member",
      "intro": "This member hasn't entered an introduction",
      "bio": "",
      "img": "../../../assets/images/member-headshots/Default.jpg"
    }
  ];
  private pastMembers?: Member[];
  private member?: Member;

  constructor() { }

  getCurrentMembers(): Member[] {
    // if (this.currentMembers) {
    //   return of(this.currentMembers);
    // } else {
    //   return this.http.get<Member>(`${environment.url}/api/members/get-current-members`);
    // }
    return this.currentMembers;
  }

  getPastMembers() {
    // if (this.pastMembers) {
    //   return of(this.pastMembers);
    // } else {
    //   return this.http.get<Member>(`${environment.url}/api/members/get-past-members`);
    // }
  }

  getMember(username: any) {
    return this.currentMembers.find(obj => obj.username == username);
    // if (this.member) {
    //   return of(this.member);
    // } else {
    //   return this.http.get<Member>(`${environment.url}/api/members/get-one`);
    // }
  }

}
