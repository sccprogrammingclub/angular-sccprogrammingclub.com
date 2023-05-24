import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';

module Utils {
  export function randomInt(min: number, max: number) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min) + min);
  }

  export class Vector2 {
    public x: number;
    public y: number;

    constructor(x: number, y: number) {
      this.x = x;
      this.y = y;
    }

    public add(other: Utils.Vector2) {
      return new Utils.Vector2(this.x + other.x, this.y + other.y);
    }

    public equals(other: Utils.Vector2) {
      return this.x == other.x && this.y == other.y;
    }

    public static random(
      minX: number,
      minY: number,
      maxX: number,
      maxY: number
    ) {
      return new Utils.Vector2(
        Utils.randomInt(minX, maxX),
        Utils.randomInt(minY, maxY)
      );
    }
  }

  export class Bounds {
    public readonly topleft: Utils.Vector2;
    public readonly bottomright: Utils.Vector2;

    constructor(x: number, y: number, width: number, height: number) {
      this.topleft = new Utils.Vector2(x, y);
      this.bottomright = new Utils.Vector2(x + width, y + height);
    }

    public get width(): number {
      return this.bottomright.x - this.topleft.x;
    }

    public get height(): number {
      return this.topleft.y - this.bottomright.y;
    }

    public randomPoint(safeguard: number = 0): Utils.Vector2 {
      return Utils.Vector2.random(
        this.topleft.x + safeguard,
        this.bottomright.y + safeguard,
        this.bottomright.x - safeguard,
        this.topleft.y - safeguard
      );
    }

    public isInBounds(tile: Utils.Vector2): boolean {
      return this.isInInXBounds(tile) && this.isInInYBounds(tile);
    }

    public isInInXBounds(tile: Utils.Vector2): boolean {
      return this.topleft.x < tile.x && tile.x < this.bottomright.x;
    }

    public isInInYBounds(tile: Utils.Vector2): boolean {
      return this.bottomright.y < tile.y && tile.y < this.topleft.y;
    }
  }

  //[left, top, right, bottom]
  export function matrixNeighbours(arr: any[][], x: number, y: number) {
    // define what a neighbor is
    const v = [
      [-1, 0],
      [0, -1],
      [1, 0],
      [0, 1],
    ];
    // filter edges & map
    return v.map(([x1, y1]) => {
      if (
        x1 + x >= 0 &&
        x1 + x < arr[0].length &&
        y1 + y >= 0 &&
        y1 + y < arr.length
      ) {
        return arr[y1 + y][x1 + x];
      }
    });
  }
}

module PacmanGame {
  const FRAME = 2;

  export type ALLOWED_FIELD_CHARACTERS =
    (typeof Field.AllowedCharacters)[number];

  export type DIRECTION = 'LEFT' | 'RIGHT' | 'UP' | 'DOWN' | 'NONE';
  export type TILE_TYPE = 'WALL' | 'GHOST' | 'POINT' | 'PACMAN' | 'EMPTY';
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
      this.field = new Field();

      this.score = new Score();
    }

    public Init(canvasRef: ElementRef): void {
      this.canvas = new Canvas(
        canvasRef.nativeElement.getContext('2d'),
        this.field.field
      );

      this.inputHandler = new InputHandler();

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

      this.inputHandler.startRecording();
      this.setState('PLAYING');
      this.gameIntervalId = setInterval(this.gameloop, (1 / FRAME) * 1000);

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

      this.inputHandler.stopRecording();
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
      if (desired_dir) this.field.pacman.direction = desired_dir;
    };

    private collisions = (): void => {};

    private draw = (): void => {
      this.canvas.drawField();
      this.canvas.drawPacman(
        this.field.pacman.position,
        this.field.pacman.position
      );
    };
  }

  abstract class Theme {
    public static readonly BOARD = '#111111';
    public static readonly WALL = '#1919A6';
    public static readonly POINT = '#FFFF00';
  }

  class Pacman {
    private _position: Utils.Vector2;
    private _direction: DIRECTION;

    constructor(pos: Utils.Vector2, dir: DIRECTION) {
      this._position = pos;
      this._direction = dir;
    }

    public reset(pos: Utils.Vector2, dir: DIRECTION): void {
      this._position = pos;
      this._direction = dir;
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

    public get position() {
      return this._position;
    }

    private getVelocity(): Utils.Vector2 {
      const velocity = new Utils.Vector2(0, 0);
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
      const velocity = this.getVelocity();
      this._position = this.position.add(velocity);
    }
  }

  class Ghost {
    private _position: Utils.Vector2;
    private _direction: DIRECTION;

    constructor(pos: Utils.Vector2, dir: DIRECTION) {
      this._position = pos;
      this._direction = dir;
    }

    public reset(pos: Utils.Vector2, dir: DIRECTION): void {
      this._position = pos;
      this._direction = dir;
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

    public get position() {
      return this._position;
    }

    private getVelocity(): Utils.Vector2 {
      const velocity = new Utils.Vector2(0, 0);
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
      const velocity = this.getVelocity();
      this._position = this.position.add(velocity);
    }
  }

  class Field {
    // public readonly bounds: Utils.Bounds;
    public readonly pacman: Pacman;
    public readonly ghosts: Ghost[];

    public static readonly AllowedCharacters = [
      ' ',
      'G',
      'P',
      '*',
      '█',
    ] as const;

    private readonly FIELD_STR_REPR = [
      '████████████████████████████',
      '█************██************█',
      '█*████*█████*██*█████*████*█',
      '█*████*█████*██*█████*████*█',
      '█*████*█████*██*█████*████*█',
      '█**************************█',
      '█*████*██*████████*██*████*█',
      '█*████*██*████████*██*████*█',
      '█******██****██****██******█',
      '██████*█████*██*█████*██████',
      '     █*█████*██*█████*██████',
      '     █*██**********██*█     ',
      '     █*██*██____██*██*█     ',
      '██████*██*██  G ██*██*██████',
      'P        *██ G  ██*         ',
      '██████*██*██  G ██*██*██████',
      '     █*██*████████*██*█     ',
      '     █*██**********██*█     ',
      '     █*██*████████*██*█     ',
      '██████*██*████████*██*██████',
      '█************██************█',
      '█*████*█████*██*█████*████*█',
      '█*████*█████*██*█████*████*█',
      '█***██****************██***█',
      '███*██*██*████████*██*██*███',
      '███*██*██*████████*██*██*███',
      '█******██****██****██******█',
      '█*██████████*██*████████████',
      '█*██████████*██*████████████',
      '█**************************█',
      '████████████████████████████',
    ];

    private readonly tileCharacterMap: {
      [K in ALLOWED_FIELD_CHARACTERS]: PacmanGame.TILE_TYPE;
    } = {
      ' ': 'EMPTY',
      '*': 'POINT',
      G: 'GHOST',
      P: 'PACMAN',
      '█': 'WALL',
    };

    public readonly field: PacmanGame.TILE_TYPE[][];

    constructor() {
      this.field = this.FIELD_STR_REPR.map((row) =>
        row
          .split('')
          .map((ch) => this.tileCharacterMap[ch as ALLOWED_FIELD_CHARACTERS])
      );

      //   this.bounds = new Utils.Bounds(
      //     0,
      //     0,
      //     this.field[0].length,
      //     this.field.length
      //   );

      const pacmanOnField = this.field.flatMap((x, i) => {
        const index = x.findIndex((v) => v == ('P' as TILE_TYPE));
        return index != -1 ? [i, index] : [];
      });

      this.pacman = new Pacman(
        new Utils.Vector2(pacmanOnField[0], pacmanOnField[1]),
        'NONE'
      );

      this.ghosts = [];
    }

    public reset(): void {}
  }

  class Canvas {
    // SLOW AND INEFFICIENT
    private readonly context: CanvasRenderingContext2D;
    private readonly tile_dims: Utils.Vector2;
    private readonly field: PacmanGame.TILE_TYPE[][];

    constructor(
      context: CanvasRenderingContext2D,
      field: PacmanGame.TILE_TYPE[][]
    ) {
      this.context = context;
      this.tile_dims = new Utils.Vector2(
        context.canvas.width / field[0].length,
        context.canvas.height / field.length
      );
      this.field = field;
    }

    private setFill(color: string): void {
      this.context.fillStyle = color;
    }

    private drawWall(pos: Utils.Vector2, neighours: TILE_TYPE[]): void {
      const WALL_WIDTH = this.tile_dims.x / 3;

      const offsets = [0, 0, 0, 0];

      this.context.beginPath();
      this.context.roundRect(
        pos.x * this.tile_dims.x + offsets[0],
        pos.y * this.tile_dims.y + offsets[1],
        this.tile_dims.x + offsets[2],
        this.tile_dims.y + offsets[3],
        4
      );
      this.context.closePath();
      this.context.fill();
    }

    private drawPoint(
      pos: Utils.Vector2,
      border: number = 2,
      corners: number[] | number = 4
    ): void {
      this.context.beginPath();
      this.context.roundRect(
        pos.x * this.tile_dims.x + border + this.tile_dims.x / 2 - 4,
        pos.y * this.tile_dims.y + border + this.tile_dims.y / 2 - 4,
        8,
        8,
        corners
      );
      this.context.fill();
    }

    private drawTile(pos: Utils.Vector2, tileType: PacmanGame.TILE_TYPE) {
      const neighbours = Utils.matrixNeighbours(this.field, pos.x, pos.y);
      switch (tileType) {
        case 'EMPTY':
          break;
        case 'GHOST':
          break;
        case 'PACMAN':
          this.setFill('yellow');
          this.drawWall(pos, neighbours);
          break;
        case 'POINT':
          this.setFill(Theme.POINT);
          this.drawPoint(pos);
          break;
        case 'WALL':
          this.setFill(Theme.WALL);
          this.drawWall(pos, neighbours);
          break;
        default:
          break;
      }
    }

    private setGlow(color: string, blur: number = 10): void {
      this.context.shadowBlur = blur;
      this.context.shadowColor = color;
    }

    public drawPacman(pos: Utils.Vector2, prev: Utils.Vector2): void {
      this.drawTile(prev, 'EMPTY');
      this.drawTile(pos, 'PACMAN');
    }

    public drawGhost(pos: Utils.Vector2, prev: Utils.Vector2): void {
      this.drawTile(prev, this.field[prev.y][prev.x]);
      this.drawTile(pos, 'GHOST');
    }

    public drawField(): void {
      this.setFill(Theme.BOARD);
      this.context.fillRect(
        0,
        0,
        this.context.canvas.width,
        this.context.canvas.height
      );

      const w = this.field[0].length;
      const h = this.field.length;

      let y = 1;
      for (let i = 0; i < w * h + 1; i++) {
        if (i > w * y) y++;
        const x = i % w;

        this.drawTile(new Utils.Vector2(x, y - 1), this.field[y - 1][x]);
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
    private _recording: boolean = false;

    constructor() {
      this.buffer = [];
    }

    public get isRecording() {
      return this._recording;
    }

    public startRecording(): void {
      document.addEventListener('keydown', this.onKeyDownHandler);
      this._recording = true;
    }

    public stopRecording() {
      document.removeEventListener('keydown', this.onKeyDownHandler);
      this._recording = false;
    }

    public addDirection(direction: DIRECTION): void {
      this.buffer.push(direction);
    }

    public getDirection(): DIRECTION | undefined {
      return this.buffer.pop();
    }

    private onKeyDownHandler = (event: KeyboardEvent) =>
      this.onKeyDown(event.key);

    private onKeyDown(key: string): void {
      const found = this.keybindings.find((v) => v.keys.includes(key));
      if (!found) return;
      this.addDirection(found.dir);
    }
  }

  export class Score {
    private _points: number;
    private _ghosts: number;

    constructor() {
      this._points = 0;
      this._ghosts = 0;
    }

    public reset() {
      this._points = 0;
      this._ghosts = 0;
    }

    public get points() {
      return this._points;
    }

    public get ghosts() {
      return this._ghosts;
    }

    public killGhost(): void {
      this._ghosts += 1;
      this._points += 5;
    }

    public eat(): void {
      this._points += 1;
    }
  }
}

module Leaderboard {
  export class LeaderboardEntry {
    public username: string;
    public points: number;
    public ghosts: number;
    public alive_for: number;
    public time: number;

    constructor(
      username: string,
      points: number = 0,
      ghosts: number = 0,
      alive_for: number = 0,
      time: number = Date.now()
    ) {
      this.username = username;
      this.points = points;
      this.ghosts = ghosts;
      this.alive_for = alive_for;
      this.time = time;
    }

    public static fromScore(username: string, score: PacmanGame.Score) {
      return new LeaderboardEntry(username, score.points, score.ghosts);
    }

    public toJSON() {
      return {
        n: this.username,
        p: this.points,
        g: this.ghosts,
        al: this.alive_for,
        t: this.time,
      };
    }

    public static fromJson(object: {
      n: string;
      p: number;
      g: number;
      al: number;
      t: number;
    }): LeaderboardEntry {
      return new LeaderboardEntry(
        object.n,
        object.p,
        object.g,
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

    public getPlace(username: string): number {
      return (
        this.leaderboard.findIndex((entry) => entry.username == username) + 1
      );
    }

    public findNeighbours(
      entry: LeaderboardEntry,
      n: number
    ): LeaderboardEntry[] {
      const index = this.leaderboard.findIndex(
        (e) => e.username == entry.username
      );
      const left = Math.max(0, index - n);
      const right = Math.min(this.leaderboard.length - 1, index + n);
      return this.leaderboard.slice(left, right + 1);
    }
  }
}

module UI {
  export type UISTATE = PacmanGame.GAMESTATE | 'NONE';

  export class FieldUI {
    private readonly overlay: ElementRef;

    private readonly gameover: ElementRef;
    private readonly gamestart: ElementRef;
    // public readonly gamepaused: ElementRef;

    private _state: UISTATE = 'WAITING_FOR_START';
    private _username: string = '';

    public uiOnStartClicked: () => void = () => {};
    public uiOnRestartClicked: () => void = () => {};
    public uiOnUsernameChanged: (username: string) => void = (
      username: string
    ) => {
      this._username = username;
    };

    public get username() {
      return this._username;
    }

    public constructor(
      overlay: ElementRef,
      gameover: ElementRef,
      gamestart: ElementRef
    ) {
      this.overlay = overlay;

      this.gameover = gameover;
      this.gamestart = gamestart;
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

    public showGameOver(): void {
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

  //baka
  export class LeaderboardUI {
    private leaderboard: Leaderboard.Leaderboard;

    constructor(leaderboard: Leaderboard.Leaderboard) {
      this.leaderboard = leaderboard;
    }

    public updateLeaderboard(leaderboard: Leaderboard.Leaderboard) {
      this.leaderboard = leaderboard;
    }

    public uiGetGameOverEntries(
      username: string,
      score: PacmanGame.Score
    ): Leaderboard.LeaderboardEntry[] {
      if (username == '') return [];
      return this.leaderboard.findNeighbours(
        Leaderboard.LeaderboardEntry.fromScore(username, score),
        1
      );
    }
  }
}

@Component({
  selector: 'app-pacman-project',
  templateUrl: './pacman-project.component.html',
  styleUrls: ['./pacman-project.component.css'],
})
export class PacmanProjectComponent implements AfterViewInit {
  @ViewChild('canvas') canvasRef!: ElementRef;

  @ViewChild('field_overlay') fieldOverlay!: ElementRef;
  @ViewChild('gameover') gameOverScreen!: ElementRef;
  @ViewChild('gamestart') gameStartScreen!: ElementRef;

  @ViewChild('gameover_restart') restartButton!: ElementRef;
  @ViewChild('gamestart_start') startButton!: ElementRef;

  game: PacmanGame.Game;
  leaderboard: Leaderboard.Leaderboard;

  fieldUI!: UI.FieldUI;
  leaderboardUI!: UI.LeaderboardUI;

  constructor() {
    this.game = new PacmanGame.Game();
    this.leaderboard = new Leaderboard.Leaderboard();
    this.leaderboardUI = new UI.LeaderboardUI(this.leaderboard);
  }

  ngAfterViewInit(): void {
    this.fieldUI = new UI.FieldUI(
      this.fieldOverlay,
      this.gameOverScreen,
      this.gameStartScreen
    );

    this.leaderboard.localLoad();
    this.leaderboardUI.updateLeaderboard(this.leaderboard);

    this.game.Init(this.canvasRef);

    this.fieldUI.uiOnStartClicked = () => {
      if (this.fieldUI.username == '') {
        return;
      }

      this.fieldUI.hideGameStart();
      this.game.startGame();
    };

    this.fieldUI.uiOnRestartClicked = () => {
      this.game.resetGame();
      this.fieldUI.showGameStart();
    };

    this.game.onGameOver = (score) => {
      const entry = Leaderboard.LeaderboardEntry.fromScore(
        this.fieldUI.username,
        score
      );

      this.leaderboard.addEntry(entry);
      this.leaderboard.localSave();
      this.leaderboardUI.updateLeaderboard(this.leaderboard);

      this.fieldUI.showGameOver();
    };

    this.fieldUI.showGameStart();
  }
}
