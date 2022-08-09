import { Component, HostListener, OnInit } from '@angular/core';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {

  screenWidth: any;
  collapsed: boolean = true;

  constructor() {
  }

  ngOnInit(): void {
    this.onResize();
  }

  @HostListener('window:resize', [])
  private onResize() {
    this.screenWidth = window.innerWidth;
  }

  show() {
    this.collapsed = false;
  }

  hide() {
    this.collapsed = true;
  }
}
