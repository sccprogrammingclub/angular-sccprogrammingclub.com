import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';

const FRAMERATE = 60;
const FRAMETIME = 1 / FRAMERATE;

class Vector2 {
  x: number;
  y: number;

  constructor(x: number, y:number) {
    this.x = x;
    this.y = y;
  }

  clone(): Vector2 {
    return new Vector2(this.x, this.y);
  }

  addMut(that: Vector2): void {
    this.x += that.x;
    this.y += that.y;
  }

  add(that: Vector2): Vector2 {
    let nv = this.clone();
    nv.addMut(that);
    return nv;
  }

  scaleMut(s: number): void {
    this.x *= s;
    this.y *= s;
  }

  scale(s: number): Vector2 {
    let nv = this.clone();
    nv.scaleMut(s);
    return nv;
  }
}

class Particle {
  pos: Vector2;
  vel: Vector2;

  constructor(nPos: Vector2) {
    this.pos = nPos;
    this.vel = new Vector2(0, 0);
  }

  update(dt: number): void {
    this.vel.addMut(new Vector2(0, 4 * dt));
    this.pos.addMut(this.vel.scale(dt));
  }
}

@Component({
  selector: 'app-powdertoy-clone',
  templateUrl: './powdertoy-clone.component.html',
  styleUrls: ['./powdertoy-clone.component.css']
})
export class PowdertoyCloneComponent implements AfterViewInit {

  @ViewChild('powdertoycanvas') canvas!: ElementRef;
  canvasCtx!: CanvasRenderingContext2D;

  particles: Particle[] = [];

  mousePos: Vector2 | undefined;
  isMouseDown: boolean = false;

  constructor() { 
  }

  ngAfterViewInit(): void {
    this.canvasCtx = this.canvas.nativeElement.getContext("2d")!;
    this.canvasCtx.fillRect(10, 10, 30, 30);

    this.canvasCtx.canvas!.addEventListener("mousedown", (ev) => this.isMouseDown = true );
    this.canvasCtx.canvas!.addEventListener("mouseup"  , (ev) => this.isMouseDown = false);
    this.canvasCtx.canvas!.addEventListener("mousemove", (ev) => this.mousePos = new Vector2(ev.x, ev.y));

    setInterval(this.gameloop, FRAMETIME * 1000);
  }

  gameloop = () => {
    this.canvasCtx.clearRect(0, 0, this.canvasCtx.canvas!.width, this.canvasCtx.canvas!.height);

    if (this.isMouseDown && this.mousePos !== undefined) {
      this.particles.push(new Particle(this.mousePos!));
    }

    for (let particle of this.particles) {
      particle.update(FRAMETIME);
    }

    for (let particle of this.particles) {
      this.canvasCtx.fillRect(particle.pos.x, particle.pos.y, 1, 1);
    }
  }
}
