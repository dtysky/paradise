/**
 * Copyright(c) dtysky<dtysky@outlook.com>
 * Created: 18 Jan 2018
 * Description:
 */
import * as React from 'react';
import * as cx from 'classnames';

function randomInt(start: number, end: number) {
  let num;
  if (window.crypto) {
    num = window.crypto.getRandomValues(new Uint8Array([1]))[0] / 255;
  } else {
    num = Math.random();
  }

  num = ~~(num * (end - start) + start);
  return num > end ? end : num;
}

class FireFly {
  private ctx: CanvasRenderingContext2D;
  private life: number;
  private originSize: number;
  private duration: number;
  private nextX: number;
  public image: HTMLCanvasElement | HTMLImageElement;
  public size: number;
  public alive: boolean;
  public x: number;
  public y: number;

  public static genTemplate(color: string, size: number) {
    const canvas = document.createElement('canvas');
    FireFly.modifyTemplate(canvas, color, size);
    return canvas;
  }

  public static modifyTemplate(canvas: HTMLCanvasElement, color: string, size: number) {
    canvas.width = size;
    canvas.height = size;
    const radius = size / 2;
    const ctx = canvas.getContext('2d');

    ctx.globalCompositeOperation = 'lighter';
    const gradient = ctx.createRadialGradient(radius, radius, 0, radius, radius, radius);
    gradient.addColorStop(0, 'rgba(255, 255, 255, .7)');
		gradient.addColorStop(0.5, color);
    gradient.addColorStop(1, 'black');
    ctx.fillStyle = gradient;
    ctx.arc(radius, radius, radius, 0, Math.PI * 2, false);
    ctx.fill();
  }

  constructor(image: HTMLCanvasElement | HTMLImageElement, size: number, life: number, ctx: CanvasRenderingContext2D) {
    this.ctx = ctx;
    this.originSize = this.size = size;
    this.life = life;
    this.image = image;
    this.x = 0;
    this.y = 0;
    this.duration = 0;
    this.nextX = randomInt(-200, 200);
    this.alive = true;
  }

  public reset(x?: number, y: number = 0) {
    this.size = this.originSize;
    this.duration = 0;
    this.x = x || this.x;
    this.y = y;
    this.nextX = randomInt(-200, 200);
    this.alive = true;
  }

  public update(escape: number) {
    if (!this.alive) {
      return;
    }

    const percent = escape / this.life;
    this.size -= this.originSize * percent;

    if (this.size <= 0) {
      this.size = 0.01;
      this.alive = false;
      return;
    }

    this.duration += escape;
    if (this.duration > 4) {
      this.duration = 0;
      this.nextX = randomInt(-200, 200);
    }

    this.x += this.nextX * (escape / 4);
  }

  public draw(escape: number) {
    this.update(escape);
    const {ctx, x, y, size} = this;
    ctx.globalCompositeOperation = 'lighter';

    ctx.drawImage(this.image, x, y, size, size);
  }
}

class FireFlies {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private rect: [number, number, number, number];
  private flies: FireFly[];
  private animateId = null;
  private ts: number = performance.now();
  private bornEscape: number = 0;
  private image: HTMLCanvasElement;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    window.addEventListener('resize', this.resize);
  }

  public init() {
    this.resize();
    this.flies = [];
    for (let i = 0; i < 5; i += 1) {
      this.born();
    }
  }

  public start() {
    this.image = FireFly.genTemplate('rgba(245, 151, 191, .7)', 32);
    this.init();
    this.ts = performance.now();
    this.bornEscape = 0;
    this.draw();
  }

  public stop() {
    cancelAnimationFrame(this.animateId);
  }

  private born() {
    const [x, y, w, h] = this.rect;

    const fireFly = new FireFly(this.image, 32, 16, this.ctx);
    fireFly.x = randomInt(0, w);
    fireFly.y = h;
    this.flies.push(fireFly);
  }

  private resize = () => {
    const {canvas} = this;

    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;

    this.rect = [0, 0, canvas.width, canvas.height];
  }

  private draw = () => {
    const {canvas, ctx} = this;
    const [x, y, w, h] = this.rect;

    ctx.clearRect(x, y, w, h);
    ctx.fillStyle = '#000000';
    ctx.rect(x, y, w, h);
    ctx.fill();

    const ts = performance.now();
    const escape = (ts - this.ts) / 1000;
    this.bornEscape += escape;

    if (this.bornEscape > 1 && this.flies.length < 50) {
      this.born();
      this.bornEscape = 0;
    }

    this.flies.forEach((fireFly, index) => {
      if (fireFly.alive) {
        fireFly.y -= escape / 16 * h * 1.5;
        fireFly.draw(escape);
      } else {
        fireFly.reset();
        fireFly.y = h + 32;
      }
    });

    this.ts = ts;
    this.animateId = requestAnimationFrame(this.draw);
  }
}

export default class FireFliesContainer extends React.Component<any, any> {
  private canvas: HTMLCanvasElement;
  private fireFlies: FireFlies;

  public componentDidMount() {
    this.fireFlies = new FireFlies(this.canvas);
    this.fireFlies.start();
  }

  public render() {
    return (
      <canvas
        className={cx('pd-full', 'pd-fire-flies')}
        ref={ref => {
          this.canvas = ref;
        }}
      />
    );
  }
}
