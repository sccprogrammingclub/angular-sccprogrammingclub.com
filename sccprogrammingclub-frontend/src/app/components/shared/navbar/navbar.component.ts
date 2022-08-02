import { Component, HostListener, OnInit } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  innerWidth: any;
  smallScreen: boolean = true;
  collapsed: boolean = true;

  constructor() {}

  ngOnInit(): void {
    this.onResize();
  }

  @HostListener('window:resize', [])
  private onResize() {
    this.innerWidth = window.innerWidth;
    if (this.innerWidth < 700) {
      this.smallScreen = true;
    } else {
      this.smallScreen = false;
    }
  }

  show() {
    this.collapsed = false;
  }

  hide() {
    this.collapsed = true;
  }
}
