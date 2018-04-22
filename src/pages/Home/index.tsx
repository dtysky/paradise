/**
 * @File   : index.tsx
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 2018-4-18 19:05:04
 * @Link: dtysky.moe
 */
import * as React from 'react';
import {Link} from 'react-router-dom';
import * as cx from 'classnames';

import {effects} from '../../routes';
import BaseList from '../BaseList';

import './base.scss';

const Home = (props: {}) => (
  <div className={cx('pd-home')}>
    <BaseList
      keys={['Effects']}
      table={{
        Effects: effects.slice()
      }}
    />
  </div>
);

export default Home;
