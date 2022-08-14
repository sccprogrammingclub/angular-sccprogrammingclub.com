import { Component, HostListener, OnInit } from '@angular/core';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {

  screenHeight: any;
  bodyHeight: any;
  bodyTallerThanScreen: boolean = false;

  constructor() { }

  ngOnInit(): void {
    this.onResize();
  }
  
  @HostListener('window:resize', [])
  private onResize() {
    this.screenHeight = window.innerHeight;
    this.bodyHeight = document.querySelector('body')?.offsetHeight;
  }

}
