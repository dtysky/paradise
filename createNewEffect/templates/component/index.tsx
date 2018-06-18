/**
 * @File   : Component.tsx
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : {DATE}
 * @Link: dtysky.moe
 */
import * as React from 'react';
import * as cx from 'classnames';

import {IControlOptions} from '../types';
import './base.scss';

export default class Component extends React.Component<IControlOptions, {}> {
  private container: React.RefObject<HTMLCanvasElement> = React.createRef();

  public componentDidMount() {
    const canvas = this.container.current;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
      this.container.current.width = window.innerWidth;
      this.container.current.height = window.innerHeight;
    });
  }

  public componentWillReceiveProps(nextProps: IControlOptions) {

  }

  public render() {
    return (
      <div className={cx('pd-{CLASS}')}>
        <canvas
          ref={this.container}
        />
      </div>
    );
  }
}
