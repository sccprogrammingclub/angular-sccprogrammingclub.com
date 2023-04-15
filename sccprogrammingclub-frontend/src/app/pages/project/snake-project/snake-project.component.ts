import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';

const SNAKE_SPEED = 5;

const FIELD_WIDTH = 20;
const FIELD_HEIGHT = 20;

function randomInt(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
}

type DIRECTION = 'left' | 'right' | 'up' | 'down';
type GAMESTATE = 'START' | 'PAUSED' | 'PLAYING' | 'OVER';

abstract class Theme {
  public static readonly HEAD = '#22c55e';
  public static readonly TAIL = '#166534';
  public static readonly BOARD = '#2e2e2e';
  public static readonly TILE = '#222222';
  public static readonly FOOD = '#FC618D';
  public static readonly FOOD_INDICATOR = '#444';

  public static getSnakeColor(index: number, length: number) {
    return this.lerpColor(Theme.HEAD, Theme.TAIL, index / length);
  }

  private static lerpColor(from: string, to: string, f: number) {
    const from_rgb = from
      .substring(1)
      .match(/.{1,2}/g)!
      .map((oct) => parseInt(oct, 16) * (1 - f));

    const to_rgb = to
      .substring(1)
      .match(/.{1,2}/g)!
      .map((oct) => parseInt(oct, 16) * f);

    let ci = [0, 1, 2].map((i) =>
      Math.min(Math.round(from_rgb[i] + to_rgb[i]), 255)
    );
    return (
      '#' +
      ci
        .reduce((a, v) => (a << 8) + v, 0)
        .toString(16)
        .padStart(6, '0')
    );
  }
}

class Vector2 {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  add(other: Vector2) {
    return new Vector2(this.x + other.x, this.y + other.y);
  }

  equals(other: Vector2) {
    return this.x == other.x && this.y == other.y;
  }

  static random(minX: number, minY: number, maxX: number, maxY: number) {
    return new Vector2(randomInt(minX, maxX), randomInt(minY, maxY));
  }
}

class Bounds {
  topleft: Vector2;
  bottomright: Vector2;

  constructor(x: number, y: number, width: number, height: number) {
    this.topleft = new Vector2(x, y);
    this.bottomright = new Vector2(x + width, y + height);
  }

  width() {
    return this.bottomright.x - this.topleft.x;
  }

  height() {
    return this.topleft.y - this.bottomright.y;
  }

  randomPoint() {
    return Vector2.random(
      this.topleft.x,
      this.bottomright.y,
      this.bottomright.x,
      this.topleft.y
    );
  }

  isInBounds(tile: Vector2) {
    return this.isInInXBounds(tile) && this.isInInYBounds(tile);
  }

  isInInXBounds(tile: Vector2) {
    return this.topleft.x < tile.x && tile.x < this.bottomright.x;
  }

  isInInYBounds(tile: Vector2) {
    return this.bottomright.y < tile.y && tile.y < this.topleft.y;
  }
}

class Snake {
  head: Vector2;
  tail: Vector2[];
  _direction: DIRECTION;

  maxTailLength: number;
  wrap: boolean;

  constructor(pos: Vector2, wrap: boolean = true) {
    this.head = pos;
    this.tail = [];
    this.wrap = wrap;

    this._direction = 'right';
    this.maxTailLength = 4;
  }

  get direction() {
    return this._direction;
  }

  set direction(dir: DIRECTION) {
    if (this.direction == 'left' || this.direction == 'right') {
      if (dir == 'up' || dir == 'down') this._direction = dir;
    } else {
      if (dir == 'left' || dir == 'right') this._direction = dir;
    }
  }

  eatApple() {
    this.maxTailLength += 2;
  }

  private getVelocity() {
    const pos = new Vector2(0, 0);
    switch (this.direction) {
      case 'left':
        pos.x -= 1;
        break;
      case 'right':
        pos.x += 1;
        break;
      case 'up':
        pos.y -= 1;
        break;
      case 'down':
        pos.y += 1;
        break;
    }
    return pos;
  }

  move() {
    this.tail.unshift(this.head);
    const velocity = this.getVelocity();
    this.head = this.head.add(velocity);

    if (this.tail.length >= this.maxTailLength) this.tail.pop();
  }
}

class Field {
  bounds: Bounds;
  snake: Snake;
  apples: Vector2[];

  constructor(width: number, height: number) {
    this.bounds = new Bounds(0, 0, width, height);
    this.snake = new Snake(this.bounds.randomPoint());
    this.apples = [];

    this.addApple();
  }

  addApple() {
    this.apples.push(this.bounds.randomPoint());
  }

  eatApple() {
    this.apples = this.apples.filter((a) => !a.equals(this.snake.head));
  }

  reset() {
    this.snake = new Snake(this.bounds.randomPoint());
    this.apples = [];
  }
}

class Canvas {
  context: CanvasRenderingContext2D;
  tile_dims: Vector2;

  constructor(
    context: CanvasRenderingContext2D,
    fieldWidth: number,
    fieldHeight: number
  ) {
    this.context = context;
    this.tile_dims = new Vector2(
      context.canvas.width / fieldWidth,
      context.canvas.height / fieldHeight
    );
  }

  private setFill(color: string) {
    this.context.fillStyle = color;
  }

  private drawTile(
    pos: Vector2,
    border: number = 2,
    corners: number[] | number = 4
  ) {
    this.context.beginPath();
    this.context.roundRect(
      pos.x * this.tile_dims.x + border,
      pos.y * this.tile_dims.y + border,
      // i don't know why, i don't want to know why
      // but it is the only way the apples will render correctly
      this.tile_dims.x - border * 2,
      this.tile_dims.y - border * 2,
      corners
    );
    this.context.fill();
  }

  private setGlow(color: string, blur: number = 10) {
    this.context.shadowBlur = blur;
    this.context.shadowColor = color;
  }

  drawApple(pos: Vector2) {
    this.setFill(Theme.FOOD);
    this.setGlow(Theme.FOOD, 30);
    this.drawTile(pos, 8, 16);
    this.setGlow(Theme.FOOD, 0);

    this.setFill(Theme.HEAD);

    this.context.beginPath();
    this.context.arc(
      pos.x * this.tile_dims.x + this.tile_dims.x / 2,
      pos.y * this.tile_dims.y + this.tile_dims.y / 8,
      15,
      0,
      0.5 * Math.PI
    );
    this.context.arc(
      pos.x * this.tile_dims.x + (this.tile_dims.x * 3) / 4,
      pos.y * this.tile_dims.y + this.tile_dims.y / 8,
      15,
      Math.PI,
      1.5 * Math.PI
    );
    this.context.fill();
    this.context.closePath();
  }

  drawSnake(snake: Snake) {
    this.setFill(Theme.HEAD);
    this.setGlow(Theme.HEAD, 50);
    this.drawTile(snake.head, 3);
    this.setGlow(Theme.HEAD, 0);

    for (let i = 0; i < snake.tail.length; i++) {
      this.setFill(Theme.getSnakeColor(i + 1, snake.tail.length + 1));
      this.drawTile(snake.tail[i], 2, 2);
    }
  }

  drawBoard() {
    this.setFill(Theme.BOARD);
    this.context.fillRect(
      0,
      0,
      this.context.canvas.width,
      this.context.canvas.height
    );

    this.setFill(Theme.TILE);
    const w = this.context.canvas.width / this.tile_dims.x;
    const h = this.context.canvas.height / this.tile_dims.y;

    let y = 1;
    for (let i = 0; i < w * h + 1; i++) {
      if (i > w * y) y++;
      const x = i % w;

      this.drawTile(new Vector2(x, y - 1));
    }
  }

  drawAppleLines(apples: Vector2[]) {
    this.setFill(Theme.FOOD_INDICATOR);
    const w = this.context.canvas.width / this.tile_dims.x;
    const h = this.context.canvas.height / this.tile_dims.y;

    const applesX = apples.map((a) => a.x);
    const applesY = apples.map((a) => a.y);

    let y = 1;
    for (let i = 0; i < w * h + 1; i++) {
      if (i > w * y) y++;
      const x = i % w;

      if (!applesY.includes(y - 1) && !applesX.includes(x)) return;

      this.context.fillRect(
        x * this.tile_dims.x + this.tile_dims.x / 2 - 2,
        (y - 1) * this.tile_dims.y + this.tile_dims.y / 2 - 2,
        4,
        4
      );
    }
  }
}

class InputHandler {
  readonly buffer: DIRECTION[];

  constructor() {
    this.buffer = [];
  }

  addDirection(direction: DIRECTION) {
    this.buffer.push(direction);
  }

  getDirection() {
    return this.buffer.pop();
  }
}

@Component({
  selector: 'app-snake-project',
  templateUrl: './snake-project.component.html',
  styleUrls: ['./snake-project.component.css'],
})
export class SnakeProjectComponent implements AfterViewInit {
  @ViewChild('canvas') canvasRef!: ElementRef;

  state: GAMESTATE = 'START';
  canvas!: Canvas;
  field!: Field;
  inputHandler!: InputHandler;

  keybindings = [
    { dir: 'left', keys: ['a', 'ArrowLeft'] },
    { dir: 'up', keys: ['w', 'ArrowUp'] },
    { dir: 'right', keys: ['d', 'ArrowRight'] },
    { dir: 'down', keys: ['s', 'ArrowDown'] },
  ];

  constructor() {}

  ngAfterViewInit(): void {
    this.canvas = new Canvas(
      this.canvasRef.nativeElement.getContext('2d'),
      FIELD_WIDTH,
      FIELD_HEIGHT
    );

    this.field = new Field(FIELD_WIDTH, FIELD_HEIGHT);

    this.inputHandler = new InputHandler();

    document.addEventListener('keydown', (event) => {
      if (this.state != 'PLAYING') return;

      const found = this.keybindings.find((v) => v.keys.includes(event.key));
      if (!found) return;
      this.inputHandler.addDirection(found.dir as DIRECTION);
    });

    this.draw();

    setInterval(this.gameloop, (1 / SNAKE_SPEED) * 1000);
  }

  gameloop = () => {
    if (this.state != 'PLAYING') return;

    this.input();
    this.collisions();
    this.draw();
  };

  input = () => {
    if (this.state != 'PLAYING') return;

    const desired_dir = this.inputHandler.getDirection();
    if (desired_dir) this.field.snake.direction = desired_dir;
  };

  collisions = () => {
    this.field.snake.move();
    const head = this.field.snake.head;

    if (this.field.apples.find((pos) => pos.equals(head))) {
      this.field.eatApple();
      this.field.snake.eatApple();
      this.field.addApple();
    }

    if (this.field.snake.tail.find((pos) => pos.equals(head))) {
      this.state = 'OVER';
      this.field.reset();
    }

    if (this.field.snake.wrap) {
      if (head.x >= this.field.bounds.bottomright.x) {
        this.field.snake.head.x = this.field.bounds.topleft.x;
      } else if (head.x < this.field.bounds.topleft.x) {
        this.field.snake.head.x = this.field.bounds.bottomright.x;
      }

      if (head.y > this.field.bounds.bottomright.y) {
        this.field.snake.head.y = this.field.bounds.topleft.y;
      } else if (head.y < this.field.bounds.topleft.y) {
        this.field.snake.head.y = this.field.bounds.bottomright.y;
      }
    } else if (!this.field.bounds.isInBounds(head)) {
      this.state = 'OVER';
      this.field.reset();
    }
  };

  draw = () => {
    this.canvas.drawBoard();
    this.canvas.drawAppleLines(this.field.apples);

    for (const apple of this.field.apples) {
      this.canvas.drawApple(apple);
    }

    this.canvas.drawSnake(this.field.snake);
  };
}
