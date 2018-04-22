/**
 * @File   : Component.tsx
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 2018-4-13 13:32:51
 * @Link: dtysky.moe
 */
import * as React from 'react';
import * as cx from 'classnames';
import * as Lottie from 'lottie-web';

import {IControlOptions} from './types';
import './base.scss';

const data = require('./data.json');

export default class Component extends React.PureComponent<IControlOptions, {}> {
  private container: HTMLDivElement;
  private lottie: any;

  public componentDidMount() {
    this.lottie = Lottie.loadAnimation({
      container: this.container,
      renderer: 'svg',
      loop: false,
      animationData: require('./data.json')
    });

    this.play();
  }

  componentWillReceiveProps(nextProps: IControlOptions) {
    if (nextProps.replay) {
      this.play();
    }
    this.lottie.loop = nextProps.loop;
    this.lottie.setDirection(nextProps.reverse ? -1 : 1);
    this.lottie.setSpeed(nextProps.speed);
    Lottie.setQuality(nextProps.quality);
  }

  private play() {
    this.lottie.stop();
    this.lottie.play();
  }

  public render() {
    return (
      <div className={cx('pd-lottie-hello-world')} >
        <div
          ref={ref => {
            this.container = ref;
          }}
        />
      </div>
    );
  }
}
