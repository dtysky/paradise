/**
 * @File   : Component.tsx
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 2018-4-10 11:58:09
 * @Link: dtysky.moe
 */
import * as React from 'react';
import * as cx from 'classnames';

import {IControlOptions} from './types';
import Tree from './Tree';
import './base.scss';

export default class Component extends React.Component<IControlOptions, {}> {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;
  private rafId = null;
  private trees: Tree[] = [];

  public componentDidMount() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
    this.ctx = this.canvas.getContext('2d');

    this.trees = [
      new Tree(this.canvas.width / 2, this.canvas.height - 128, [Math.round(Math.random() * 360), 80, 80])
    ];
    
    this.loop();
  }

  public componentWillReceiveProps(nextProps: IControlOptions) {
    Object.keys(nextProps).forEach(key => {
      if (key === 'clear' && nextProps[key]) {
        this.clear();
      } else if (key !== 'clear') {
        Tree[key] = nextProps[key];
      }
    });
  }

  public componentWillUnmount() {
    cancelAnimationFrame(this.rafId);
  }

  private clear() {
    this.trees = [];
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  private generate = (event: React.MouseEvent<HTMLCanvasElement>) => {
    this.ctx.fillStyle = 'rgba(255, 255, 255, .1)';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    const {
      clientX: x,
      clientY: y
    } = event;

    this.trees.push(new Tree(x, y, [Math.round(Math.random() * 360), 80, 80]));
  }

  private loop = () => {
    this.trees.forEach(tree => {
      if (tree.drawn) {
        this.trees.splice(this.trees.indexOf(tree), 1);
        return;
      }

      tree.update();
      tree.draw(this.ctx);
    });
    this.rafId = requestAnimationFrame(this.loop);
  }

  private draw(tree: Tree) {
    tree.draw(this.ctx);
  }

  public render() {
    return (
      <div className={cx('pd-trees-generator-2d')}>
        <canvas
          ref={ref => {
            this.canvas = ref;
          }}
          onClick={this.generate}
        />
        <p>Click to plant a seed</p>
      </div>
    );
  }
}
