/**
 * @File   : index.tsx
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 2018-4-18 19:06:07
 * @Link: dtysky.moe
 */
import * as React from 'react';
import {Link} from 'react-router-dom';
import * as cx from 'classnames';
import Icon from 'antd/es/icon';
import 'antd/es/icon/style/css';

import './base.scss';

export default class Bottom extends React.PureComponent<{}, {}> {
  public render() {
    return (
      <div className={'pd-bottom'}>
        <div className={'pd-bottom-msg'}>
          Here is a site for collection of amazing effects.
          <br />
          If you have any suggestions or ideas, please contact me.
          <br />
          Let's make this world beautiful together.
        </div>
        <div className={'pd-bottom-info'}>
          <a href={'http://dtysky.moe'} target={'_blank'}>
            <Icon type={'user'} /> 
            dtysky.moe
          </a>
          <a href={'mailto://dtysky@outlook.com'} target={'_blank'}>
            <Icon type={'mail'} /> 
            dtysky@outlook.com
          </a>
          <a href={'https://github.com/dtysky/paradise'} target={'_blank'}>
            <Icon type={'github'} /> 
            paradise
          </a>
        </div>
      </div>
    );
  }
}
