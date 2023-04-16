// I did not want to pollute the NgModule with several components for one game,
// so good luck to anyone who tries to make sense of this mess

// I hate angular

import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';

module Utils {
  export function randomInt(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
  }
}

module SnakeGame {
  const SNAKE_SPEED = 5;

  const FIELD_WIDTH = 20;
  const FIELD_HEIGHT = 20;

  type DIRECTION = 'LEFT' | 'RIGHT' | 'UP' | 'DOWN';
  export type GAMESTATE = 'WAITING_FOR_START' | 'PAUSED' | 'PLAYING' | 'OVER';

  export class Game {
    private _state: GAMESTATE = 'WAITING_FOR_START';

    private canvas!: Canvas;
    private readonly field: Field;
    private inputHandler!: InputHandler;

    private gameIntervalId: number | undefined;
    public readonly score: Score;

    private initialized: boolean = false;

    public onGameStart: () => void = () => {};
    public onGameReset: () => void = () => {};
    public onGamePaused: (score: Score) => void = (_score) => {};
    public onGameOver: (score: Score) => void = (_score) => {};

    constructor() {
      this.field = new Field(FIELD_WIDTH, FIELD_HEIGHT);

      this.score = new Score();
    }

    public Init(canvasRef: ElementRef): void {
      this.canvas = new Canvas(
        canvasRef.nativeElement.getContext('2d'),
        FIELD_WIDTH,
        FIELD_HEIGHT
      );

      this.inputHandler = new InputHandler();
      document.addEventListener('keydown', (event) =>
        this.inputHandler.onKeyDown(event.key)
      );

      this.initialized = true;

      this.draw();
    }

    private setState(state: GAMESTATE): void {
      this._state = state;
    }

    public getState(): GAMESTATE {
      return this._state;
    }

    public startGame(): void {
      if (!this.initialized) throw new Error('Call Init()');

      this.setState('PLAYING');
      this.gameIntervalId = setInterval(
        this.gameloop,
        (1 / SNAKE_SPEED) * 1000
      );

      this.onGameStart();
    }

    public resetGame(): void {
      if (!this.initialized) throw new Error('Call Init()');

      this.score.reset();
      this.field.reset();
      this.draw();

      this.onGameReset();
      this.setState('WAITING_FOR_START');
    }

    public pauseGame(): void {
      if (!this.initialized) throw new Error('Call Init()');
      if (this.getState() != 'PLAYING') throw new Error('No ongoing game');

      clearInterval(this.gameIntervalId);
      this.setState('PAUSED');

      this.onGamePaused(this.score);
    }

    public finishGame(): void {
      if (!this.initialized) throw new Error('Call Init()');
      if (this.getState() != 'PLAYING') throw new Error('No ongoing game');

      clearInterval(this.gameIntervalId);
      this.setState('OVER');

      this.onGameOver(this.score);
    }

    private gameloop = (): void => {
      if (this.getState() != 'PLAYING') return;

      this.input();
      this.collisions();
      this.draw();
    };

    private input = (): void => {
      const desired_dir = this.inputHandler.getDirection();
      if (desired_dir) this.field.snake.direction = desired_dir;
    };

    private collisions = (): void => {
      this.field.snake.move();
      const head = this.field.snake.head;

      if (this.field.apples.find((pos) => pos.equals(head))) {
        this.field.eatApple();
        this.field.snake.eatApple();
        this.field.addApple();

        this.score.eatApple();
      }

      if (this.field.snake.tail.find((pos) => pos.equals(head))) {
        this.finishGame();
      }

      if (this.field.snake.wrap) {
        if (head.x >= this.field.bounds.bottomright.x) {
          this.field.snake.head.x = this.field.bounds.topleft.x;
        } else if (head.x < this.field.bounds.topleft.x) {
          this.field.snake.head.x = this.field.bounds.bottomright.x;
        }

        if (head.y >= this.field.bounds.bottomright.y) {
          this.field.snake.head.y = this.field.bounds.topleft.y;
        } else if (head.y < this.field.bounds.topleft.y) {
          this.field.snake.head.y = this.field.bounds.bottomright.y;
        }
      } else if (!this.field.bounds.isInBounds(head)) {
        this.finishGame();
      }
    };

    private draw = (): void => {
      this.canvas.drawBoard();
      this.canvas.drawAppleLines(this.field.apples);
      this.canvas.drawApples(this.field.apples);
      this.canvas.drawSnake(this.field.snake);
    };
  }

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
    public x: number;
    public y: number;

    constructor(x: number, y: number) {
      this.x = x;
      this.y = y;
    }

    public add(other: Vector2) {
      return new Vector2(this.x + other.x, this.y + other.y);
    }

    public equals(other: Vector2) {
      return this.x == other.x && this.y == other.y;
    }

    public static random(
      minX: number,
      minY: number,
      maxX: number,
      maxY: number
    ) {
      return new Vector2(
        Utils.randomInt(minX, maxX),
        Utils.randomInt(minY, maxY)
      );
    }
  }

  class Bounds {
    public readonly topleft: Vector2;
    public readonly bottomright: Vector2;

    constructor(x: number, y: number, width: number, height: number) {
      this.topleft = new Vector2(x, y);
      this.bottomright = new Vector2(x + width, y + height);
    }

    public get width(): number {
      return this.bottomright.x - this.topleft.x;
    }

    public get height(): number {
      return this.topleft.y - this.bottomright.y;
    }

    public randomPoint(): Vector2 {
      return Vector2.random(
        this.topleft.x,
        this.bottomright.y,
        this.bottomright.x,
        this.topleft.y
      );
    }

    public isInBounds(tile: Vector2): boolean {
      return this.isInInXBounds(tile) && this.isInInYBounds(tile);
    }

    public isInInXBounds(tile: Vector2): boolean {
      return this.topleft.x < tile.x && tile.x < this.bottomright.x;
    }

    public isInInYBounds(tile: Vector2): boolean {
      return this.bottomright.y < tile.y && tile.y < this.topleft.y;
    }
  }

  class Snake {
    private _head: Vector2;
    private _direction: DIRECTION;

    public readonly tail: Vector2[];
    public readonly wrap: boolean;

    private maxTailLength: number;

    constructor(pos: Vector2, dir: DIRECTION, wrap: boolean = true) {
      this._head = pos;
      this._direction = dir;

      this.tail = [];
      this.wrap = wrap;

      this.maxTailLength = 4;
    }

    public reset(pos: Vector2, dir: DIRECTION): void {
      this._head = pos;
      this._direction = dir;

      this.tail.length = 0;

      this.maxTailLength = 4;
    }

    public set direction(dir: DIRECTION) {
      if (this.direction == 'LEFT' || this.direction == 'RIGHT') {
        if (dir == 'UP' || dir == 'DOWN') this._direction = dir;
      } else {
        if (dir == 'LEFT' || dir == 'RIGHT') this._direction = dir;
      }
    }

    public get direction() {
      return this._direction;
    }

    private set head(pos: Vector2) {
      this._head = pos;
    }

    public get head() {
      return this._head;
    }

    public eatApple(): void {
      this.maxTailLength += 2;
    }

    private getVelocity(): Vector2 {
      const velocity = new Vector2(0, 0);
      switch (this.direction) {
        case 'LEFT':
          velocity.x -= 1;
          break;
        case 'RIGHT':
          velocity.x += 1;
          break;
        case 'UP':
          velocity.y -= 1;
          break;
        case 'DOWN':
          velocity.y += 1;
          break;
      }
      return velocity;
    }

    public move(): void {
      this.tail.unshift(this.head);
      const velocity = this.getVelocity();
      this._head = this.head.add(velocity);

      if (this.tail.length >= this.maxTailLength) this.tail.pop();
    }
  }

  class Field {
    public readonly bounds: Bounds;
    public readonly snake: Snake;
    public readonly apples: Vector2[];

    constructor(width: number, height: number) {
      this.bounds = new Bounds(0, 0, width, height);
      this.snake = new Snake(this.bounds.randomPoint(), 'RIGHT');
      this.apples = [];

      this.addApple();
    }

    public reset(): void {
      this.snake.reset(this.bounds.randomPoint(), 'RIGHT');
      this.apples.length = 0;
      this.addApple();
    }

    public addApple(): Vector2 {
      const pos = this.bounds.randomPoint();
      this.apples.push(pos);
      return pos;
    }

    public eatApple(): boolean {
      const pos = this.apples.findIndex((a) => a.equals(this.snake.head));
      if (pos != -1) this.apples.splice(pos, 1);
      return pos != -1;
    }
  }

  class Canvas {
    // SLOW AND INEFFICIENT
    //
    // I AM ONLY HUMAN, after all
    // don't put the blam on me
    // don't put the blam on me...
    private readonly context: CanvasRenderingContext2D;
    private readonly tile_dims: Vector2;

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

    private setFill(color: string): void {
      this.context.fillStyle = color;
    }

    private drawTile(
      pos: Vector2,
      border: number = 2,
      corners: number[] | number = 4
    ): void {
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

    private setGlow(color: string, blur: number = 10): void {
      this.context.shadowBlur = blur;
      this.context.shadowColor = color;
    }

    public drawApples(apples: Vector2[]): void {
      for (const apple of apples) {
        this.setFill(Theme.FOOD);
        this.setGlow(Theme.FOOD, 30);
        this.drawTile(apple, 8, 16);
        this.setGlow(Theme.FOOD, 0);

        this.setFill(Theme.HEAD);

        this.context.beginPath();
        this.context.arc(
          apple.x * this.tile_dims.x + this.tile_dims.x / 2,
          apple.y * this.tile_dims.y + this.tile_dims.y / 8,
          15,
          0,
          0.5 * Math.PI
        );
        this.context.arc(
          apple.x * this.tile_dims.x + (this.tile_dims.x * 3) / 4,
          apple.y * this.tile_dims.y + this.tile_dims.y / 8,
          15,
          Math.PI,
          1.5 * Math.PI
        );
        this.context.fill();
        this.context.closePath();
      }
    }

    public drawSnake(snake: Snake): void {
      this.setFill(Theme.HEAD);
      this.setGlow(Theme.HEAD, 50);
      this.drawTile(snake.head, 3);
      this.setGlow(Theme.HEAD, 0);

      for (let i = 0; i < snake.tail.length; i++) {
        this.setFill(Theme.getSnakeColor(i + 1, snake.tail.length + 1));
        this.drawTile(snake.tail[i], 2, 2);
      }
    }

    public drawBoard(): void {
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

    public drawAppleLines(apples: Vector2[]): void {
      this.setFill(Theme.FOOD_INDICATOR);
      const w = this.context.canvas.width / this.tile_dims.x;
      const h = this.context.canvas.height / this.tile_dims.y;

      const applesX = apples.map((a) => a.x);
      const applesY = apples.map((a) => a.y);

      let y = 1;
      for (let i = 0; i < w * h + 1; i++) {
        if (i > w * y) y++;
        const x = i % w;

        if (!applesY.includes(y - 1) && !applesX.includes(x)) continue;

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
    private readonly buffer: DIRECTION[];
    private readonly keybindings: Array<{ dir: DIRECTION; keys: string[] }> = [
      { dir: 'LEFT', keys: ['a', 'ArrowLeft'] },
      { dir: 'UP', keys: ['w', 'ArrowUp'] },
      { dir: 'RIGHT', keys: ['d', 'ArrowRight'] },
      { dir: 'DOWN', keys: ['s', 'ArrowDown'] },
    ];

    constructor() {
      this.buffer = [];
    }

    public addDirection(direction: DIRECTION): void {
      this.buffer.push(direction);
    }

    public getDirection(): DIRECTION | undefined {
      return this.buffer.pop();
    }

    public onKeyDown(key: string): void {
      const found = this.keybindings.find((v) => v.keys.includes(key));
      if (!found) return;
      this.addDirection(found.dir);
    }
  }

  export class Score {
    private _points: number;
    private _apples: number;

    private elapsedSeconds: number;
    private interval: number;

    constructor() {
      this._points = 0;
      this._apples = 0;

      this.elapsedSeconds = 0;
      this.interval = setInterval(() => {
        this.elapsedSeconds++;
      }, 1000);
    }

    public destroy(): void {
      clearInterval(this.interval);
    }

    public reset() {
      this._points = 0;
      this._apples = 0;
    }

    public get points() {
      return this._points;
    }

    public get apples() {
      return this._apples;
    }

    public eatApple(): void {
      this._apples += 1;
      this._points += Math.round((1 / this.elapsedSeconds) * 60 * this.apples);
      this.elapsedSeconds = 0;
    }
  }
}

module Leaderboard {
  export class LeaderboardEntry {
    public username: string;
    public points: number;
    public apples: number;
    public alive_for: number;
    public time: number;

    constructor(
      username: string,
      points: number = 0,
      apples: number = 0,
      alive_for: number = 0,
      time: number = Date.now()
    ) {
      this.username = username;
      this.points = points;
      this.apples = apples;
      this.alive_for = alive_for;
      this.time = time;
    }

    public static fromScore(username: string, score: SnakeGame.Score) {
      return new LeaderboardEntry(username, score.points, score.apples);
    }

    public toJSON() {
      return {
        n: this.username,
        p: this.points,
        a: this.apples,
        al: this.alive_for,
        t: this.time,
      };
    }

    public static fromJson(object: {
      n: string;
      p: number;
      a: number;
      al: number;
      t: number;
    }): LeaderboardEntry {
      return new LeaderboardEntry(
        object.n,
        object.p,
        object.a,
        object.al,
        object.t
      );
    }
  }

  export class Leaderboard {
    private readonly key = 'snakeGameLocalLeaderboard';
    private leaderboard: Array<LeaderboardEntry>;

    constructor() {
      this.leaderboard = [];
    }

    public get(n: number, start: number = 0) {
      return this.leaderboard.slice(start, start + n);
    }

    public localLoad(): void {
      const json = localStorage.getItem(this.key);
      if (json) {
        const saved: Array<any> = JSON.parse(json);
        this.leaderboard = saved.map((v) => LeaderboardEntry.fromJson(v));
      } else {
        this.localSave();
      }
    }

    public localSave(): void {
      localStorage.setItem(this.key, JSON.stringify(this.leaderboard));
    }

    public addEntry(entry: LeaderboardEntry): void {
      const foundIndex = this.leaderboard.findIndex(
        (v) => v.username == entry.username
      );

      if (foundIndex != -1) {
        if (this.leaderboard[foundIndex].points > entry.points) return;

        this.leaderboard.splice(foundIndex, 1);
      }

      const insertIndex = this.leaderboard.findIndex(
        (v) => v.points < entry.points
      );
      console.log(insertIndex);
      this.leaderboard.splice(
        insertIndex == -1 ? this.leaderboard.length : insertIndex,
        0,
        entry
      );
    }

    public findNeighbours(
      entry: LeaderboardEntry,
      n: number
    ): LeaderboardEntry[] {
      const index = this.leaderboard.indexOf(entry);
      const left = Math.max(0, index - n);
      const right = Math.min(this.leaderboard.length - 1, index + n);
      return this.leaderboard.slice(left, right + 1);
    }
  }
}

module UI {
  export type UISTATE = SnakeGame.GAMESTATE | 'NONE';

  export class FieldUI {
    private readonly overlay: ElementRef;

    private readonly gameover: ElementRef;
    private readonly gamestart: ElementRef;
    // public readonly gamepaused: ElementRef;

    private readonly restartButton: ElementRef;
    private readonly startButton: ElementRef;

    private _state: UISTATE = 'WAITING_FOR_START';

    public onStartClicked: () => void = () => {};
    public onRestartClicked: () => void = () => {};

    public constructor(
      overlay: ElementRef,
      gameover: ElementRef,
      gamestart: ElementRef,

      restartButton: ElementRef,
      startButton: ElementRef
    ) {
      this.overlay = overlay;

      this.gameover = gameover;
      this.gamestart = gamestart;

      this.restartButton = restartButton;
      this.startButton = startButton;
    }

    public getState(): UISTATE {
      return this._state;
    }

    private showFieldOverlay(): void {
      this.overlay.nativeElement.style.display = 'flex';
    }

    private hideFieldOverlay(): void {
      this.hideElement(this.overlay);
    }

    private showElement(ref: ElementRef): void {
      ref.nativeElement.style.display = 'block';
    }

    private hideElement(ref: ElementRef): void {
      ref.nativeElement.style.display = 'none';
    }

    public showGameOver(score: Leaderboard.LeaderboardEntry): void {
      this._state = 'OVER';
      this.showFieldOverlay();
      this.showElement(this.gameover);
    }

    public hideGameOver(): void {
      this.hideFieldOverlay();
      this.hideElement(this.gameover);
      this._state = 'NONE';
    }

    public showGameStart(): void {
      if (this.getState() == 'OVER') {
        this.hideElement(this.gameover);
        this.showElement(this.gamestart);
        this._state = 'WAITING_FOR_START';
        return;
      }

      this.showFieldOverlay();
      this.showElement(this.gamestart);
      this._state = 'WAITING_FOR_START';
    }

    public hideGameStart(): void {
      this.hideFieldOverlay();
      this.hideElement(this.gamestart);
      this._state = 'NONE';
    }
  }

  export class LeaderboardUI {
    leaderboard: Leaderboard.Leaderboard;

    constructor(leaderboard: Leaderboard.Leaderboard) {
      this.leaderboard = leaderboard;
    }
  }
}

@Component({
  selector: 'app-snake-project',
  templateUrl: './snake-project.component.html',
  styleUrls: ['./snake-project.component.css'],
})
export class SnakeProjectComponent implements AfterViewInit {
  @ViewChild('canvas') canvasRef!: ElementRef;

  @ViewChild('field_overlay') fieldOverlay!: ElementRef;
  @ViewChild('gameover') gameOverScreen!: ElementRef;
  @ViewChild('gamestart') gameStartScreen!: ElementRef;

  @ViewChild('gameover_restart') restartButton!: ElementRef;
  @ViewChild('gamestart_start') startButton!: ElementRef;

  game: SnakeGame.Game;
  leaderboard: Leaderboard.Leaderboard;
  ui!: UI.FieldUI;

  constructor() {
    this.game = new SnakeGame.Game();
    this.leaderboard = new Leaderboard.Leaderboard();
  }

  ngAfterViewInit(): void {
    this.ui = new UI.FieldUI(
      this.fieldOverlay,
      this.gameOverScreen,
      this.gameStartScreen,
      this.restartButton,
      this.startButton
    );

    this.leaderboard.localLoad();

    this.game.Init(this.canvasRef);

    this.ui.onStartClicked = () => {
      this.ui.hideGameStart();
      this.game.startGame();
    };

    this.ui.onRestartClicked = () => {
      this.game.resetGame();
      this.ui.showGameStart();
    };

    this.game.onGameOver = (score) => {
      const entry = Leaderboard.LeaderboardEntry.fromScore('OK', score);

      this.leaderboard.addEntry(entry);
      this.leaderboard.localSave();

      this.ui.showGameOver(entry);
    };

    this.ui.showGameStart();
    // this.game.startGame();
  }
}
