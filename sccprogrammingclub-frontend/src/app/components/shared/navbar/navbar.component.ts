import { Component, HostListener, OnInit } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {

  screenWidth: any;
  smallScreen: boolean = true;
  collapsed: boolean = true;

  constructor() {
  }

  ngOnInit(): void {
    this.onResize();
  }

  @HostListener('window:resize', [])
  private onResize() {
    this.screenWidth = window.innerWidth;
    if (this.screenWidth < 500) {
      this.smallScreen = true;
    } else {
      this.smallScreen = false;
    }
  }

  hide() {
    this.collapsed = true;
  }

  onClickMenu() {
    if (this.collapsed) {
      this.collapsed = false;
    } else {
      this.collapsed = true;
    }
    return this.collapsed;
  }
}
