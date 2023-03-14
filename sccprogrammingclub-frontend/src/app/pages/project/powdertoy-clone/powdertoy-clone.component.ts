import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';

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

  asTuple(): [number, number] {
    return [this.x, this.y];
  }

  lenSqr(): number {
    return this.x * this.x
         + this.y * this.y;
  }

  len(): number {
    return Math.sqrt(this.lenSqr());
  }

  dot(that: Vector2): number {
    return this.x * that.x
         + this.y * that.y;
  }

  distanceSqr(that: Vector2): number {
    let dx = this.x - that.x;
    let dy = this.y - that.y;
    return dx * dx + dy * dy;
  }

  distance(that: Vector2): number {
    return this.sub(that).len();
  }

  addMut(that: Vector2): Vector2 {
    this.x += that.x;
    this.y += that.y;

    return this;
  }

  add(that: Vector2): Vector2 {
    return new Vector2(this.x + that.x, this.y + that.y);
  }

  subMut(that: Vector2): Vector2 {
    this.x -= that.x;
    this.y -= that.y;

    return this;
  }

  sub(that: Vector2): Vector2 {
    return new Vector2(this.x - that.x, this.y - that.y);
  }

  scaleMut(s: number): Vector2 {
    this.x *= s;
    this.y *= s;

    return this;
  }

  scale(s: number): Vector2 {
    return new Vector2(this.x * s, this.y * s);
  }

  intAlignMut(): Vector2 {
    this.x = Math.floor(this.x);
    this.y = Math.floor(this.y);

    return this;
  }

  intAlign(): Vector2 {
    return new Vector2(Math.floor(this.x), Math.floor(this.y));
  }
}

class Bounds {
  readonly topleft: Vector2;
  readonly bottomright: Vector2;

  constructor(x: number, y: number, width: number, height: number) {
    this.topleft = new Vector2(x, y);
    this.bottomright = new Vector2(x + width, y + height);
  }

  width(): number {
    return this.bottomright.x - this.topleft.x;
  }

  height(): number {
    return this.bottomright.y - this.topleft.y;
  }
}

class Particle {
  pos: Vector2;
  vel: Vector2;

  constructor(nPos: Vector2) {
    this.pos = nPos;
    this.vel = new Vector2(0, 0);
  }

  update(dt: number, bounds: Bounds): void {
    this.vel.addMut(new Vector2(0, 4 * dt));
    this.pos.addMut(this.vel.scale(dt));

    if (this.pos.y > bounds.bottomright.y) {
      this.pos.y = bounds.bottomright.y;
      this.vel.y = 0;
    }
  }
}

type Chunk = [number, number];

class ParticleMap {
  readonly chunkSize: number;
  readonly invChunkSize: number;
  readonly bounds: Bounds;
  readonly chunkXCount: number;
  readonly chunkYCount: number;

  chunks: Map<number, Particle[]>;

  constructor(nChunkSize: number, nBounds: Bounds) {
    this.chunkSize = nChunkSize;
    this.invChunkSize = 1 / nChunkSize;
    this.bounds = nBounds;
    this.chunkXCount = Math.ceil(this.bounds.width () * this.invChunkSize);
    this.chunkYCount = Math.ceil(this.bounds.height() * this.invChunkSize);

    this.chunks = new Map();
  }

  addParticle(p: Particle): void {
    this.addParticleToChunk(p, this.particleToChunk(p));
  }

  addParticleToChunk(p: Particle, chunk: Chunk): void {
    let key = this.chunkToKey(chunk);

    if (this.chunks.has(key)) this.chunks.get(key)!.push(p);
    else this.chunks.set(key, [p]);
  }

  update(): void {
    for (let [chunkKey, particles] of this.chunks) for (let particle of particles) {
      particle.update(FRAMETIME, this.bounds);

      this.doInteractions(this.keyToChunk(chunkKey), particle, (p1, p2) => {
        let distanceSqr = p1.pos.distanceSqr(p2.pos);
        if (distanceSqr > 1) return;

        let dPos = p1.pos.sub(p2.pos);

        p1.pos.addMut(dPos.scale(0.5));
        p1.vel.subMut(dPos.scale(p1.vel.dot(dPos)));
      });
    }

    this.refreshParticleChunks();
  }

  refreshParticleChunks(): void {
    for (let [chunkKey, particles] of this.chunks) {
      let apparentChunk = this.keyToChunk(chunkKey);
      for (let i = 0; i < particles.length; i++) {
        let inChunkX = particles[i].pos.x - apparentChunk[0] * this.chunkSize;
        if (inChunkX >= 0 && inChunkX <= this.chunkSize) {
          let inChunkY = particles[i].pos.y - apparentChunk[1] * this.chunkSize;
          if (inChunkY >= 0 && inChunkY <= this.chunkSize) continue;
        }

        this.addParticle(particles[i]);
        if (particles.length > i + 1) particles[i] = particles.pop()!;
        else particles.pop();
        // i--;
      }
    }
  }

  forAllParticles(whatToDo: (_: Particle) => void): void {
    for (let [_, ps] of this.chunks) for (let p of ps) {
      whatToDo(p);
    }
  }

  doInteractions(chunk: Chunk, p1: Particle, interact: (_a: Particle, _b: Particle) => void): void {
    let iterParticles = (ps: Particle[]) => { for (let i = 0; i < ps.length; i++) if (p1 !== ps[i]) interact(p1, ps[i]); };

    iterParticles(this.chunkToParticles  (chunk                     ));
    iterParticles(this.chunkXYToParticles(chunk[0] - 1, chunk[1] - 1));
    iterParticles(this.chunkXYToParticles(chunk[0]    , chunk[1] - 1));
    iterParticles(this.chunkXYToParticles(chunk[0] + 1, chunk[1] - 1));
    iterParticles(this.chunkXYToParticles(chunk[0] - 1, chunk[1]    ));
    iterParticles(this.chunkXYToParticles(chunk[0] + 1, chunk[1]    ));
    iterParticles(this.chunkXYToParticles(chunk[0] - 1, chunk[1] + 1));
    iterParticles(this.chunkXYToParticles(chunk[0]    , chunk[1] + 1));
    iterParticles(this.chunkXYToParticles(chunk[0] + 1, chunk[1] + 1));
  }

  chunkToParticles(chunk: Chunk): Particle[] {
    return this.chunks.get(this.chunkToKey(chunk)) ?? [];
  }

  chunkXYToParticles(cx: number, cy: number): Particle[] {
    return this.chunks.get(this.chunkXYToKey(cx, cy)) ?? [];
  }

  particleToChunk(p: Particle): Chunk {
    return p.pos.scale(this.invChunkSize).intAlignMut().asTuple();
  }

  chunkToKey(chunk: Chunk): number {
    return chunk[0] + this.chunkXCount * chunk[1];
  }

  chunkXYToKey(cx: number, cy: number): number {
    return cx + this.chunkXCount * cy;
  }

  keyToChunk(key: number): Chunk {
    return [key % this.chunkXCount, Math.floor(key / this.chunkXCount)];
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

  particleMap!: ParticleMap;

  mousePos: Vector2 | undefined;
  isMouseDown: boolean = false;

  constructor() { 
  }

  ngAfterViewInit(): void {
    this.canvasCtx = this.canvas.nativeElement.getContext("2d")!;

    this.canvasCtx.canvas!.addEventListener("mousedown", (ev) => this.isMouseDown = true );
    this.canvasCtx.canvas!.addEventListener("mouseup"  , (ev) => this.isMouseDown = false);
    this.canvasCtx.canvas!.addEventListener("mousemove", (ev) => 
      { if (!isNaN(ev.x) && !isNaN(ev.y)) this.mousePos = new Vector2(ev.x, ev.y) });

    this.particleMap = new ParticleMap(
      4,
      new Bounds(0, 0, this.canvasCtx.canvas!.width, this.canvasCtx.canvas!.height - 100),
    );

    setInterval(this.gameloop, FRAMETIME * 1000);
  }

  gameloop = () => {
    this.doInput();

    this.doPhysics();

    this.draw();
  }

  doInput(): void {
    if (this.isMouseDown && this.mousePos !== undefined) {
      this.particleMap.addParticle(new Particle(this.mousePos!.clone()));
    }
  }

  doPhysics(): void {
    this.particleMap.update();
  }

  draw(): void {
    this.canvasCtx.clearRect(0, 0, this.canvasCtx.canvas!.width, this.canvasCtx.canvas!.height);

    this.particleMap.forAllParticles((particle) => {
      this.canvasCtx.fillRect(particle.pos.x, particle.pos.y, 1, 1);
    });
  }
}
