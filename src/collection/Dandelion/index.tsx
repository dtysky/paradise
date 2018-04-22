/**
 * Copyright(c) dtysky<dtysky@outlook.com>
 * Created: 18 Jan 2018
 * Description:
 */
import * as React from 'react';
import * as cx from 'classnames';

import './bass.scss';

export default class Dandelion extends React.Component<any, any> {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private rect: [number, number, number, number];

  public componentDidMount() {
    this.ctx = this.canvas.getContext('2d');
    this.init();
  }

  private init() {
    this.resize();

    const {canvas, ctx} = this;
    this.rect = [0, 0, canvas.width, canvas.height];

    const [x, y, w, h] = this.rect;
    ctx.clearRect(x, y, w, h);

    ctx.fillStyle = '#000000';
    ctx.rect(x, y, w, h);
    ctx.fill();

    this.drawOne(w / 2, h / 2, 64);
  }

  private resize() {
    const {canvas} = this;

    canvas.width = canvas.clientWidth;
    canvas.height = canvas.clientHeight;
  }

  private drawOne(x: number, y: number, size: number) {
    const {rect, ctx} = this;

    const left = x - size / 2;
    const right = x + size / 2;

    const radius = size / 3;
    const top = y - radius;
    const bottom = y + radius * 2;

    ctx.globalAlpha = .7;
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#ffffff';
    ctx.beginPath();

    ctx.moveTo(x, top);
    ctx.lineTo(x, bottom);

    const x1 = radius;
    const y1 = radius * 3 / 4;
    ctx.moveTo(x, y);
    ctx.lineTo(x - x1, y - y1);
    ctx.moveTo(x, y);
    ctx.lineTo(x + x1, y - y1);

    const x2 = radius;
    const y2 = radius / 2;
    ctx.moveTo(x, y);
    ctx.lineTo(x - x2, y - y2);
    ctx.moveTo(x, y);
    ctx.lineTo(x + x2, y - y2);

    const x3 = radius;
    const y3 = radius / 4;
    ctx.moveTo(x, y);
    ctx.lineTo(x - x3, y - y3);
    ctx.moveTo(x, y);
    ctx.lineTo(x + x3, y - y3);

    ctx.stroke();
    ctx.closePath();
  }

  public render() {
    return (
      <canvas
        className={cx('pd-dandelion')}
        ref={ref => {
          this.canvas = ref;
        }}
      />
    );
  }
}
