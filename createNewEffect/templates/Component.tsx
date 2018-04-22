/**
 * @File   : Component.tsx
 * @Author : {AUTHOR}
 * @Date   : {DATE}
 * @Link: dtysky.moe
 */
import * as React from 'react';
import * as cx from 'classnames';

import {IControlOptions} from './types';
import './base.scss';

export default class Component extends React.Component<IControlOptions, {}> {
  public render() {
    return (
      <div className={cx('pd-{CLASS}')}>
      </div>
    );
  }
}
