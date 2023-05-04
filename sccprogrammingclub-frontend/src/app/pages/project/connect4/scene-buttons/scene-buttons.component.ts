import { Component } from '@angular/core';

@Component({
  selector: 'app-scene-buttons',
  templateUrl: './scene-buttons.component.html',
  styleUrls: ['./scene-buttons.component.css'],
})
export class SceneButtonsComponent {
  constructor() {}

  switchScene(name: string): void {
    document.body.style.backgroundImage = 'url("./assets/' + name + '.jpg")';
  }

  reset(): void {
    window.location.reload();
  }
}