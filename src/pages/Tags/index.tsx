/**
 * @File   : index.tsx
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 2018-4-18 19:05:37
 * @Link: dtysky.moe
 */
import * as React from 'react';
import {Link} from 'react-router-dom';
import * as cx from 'classnames';

import {tags, tagsTable} from '../../routes';
import BaseList from '../BaseList';

import './base.scss';

const Tags = (props: {}) => (
  <div className={cx('pd-tags')}>
    <BaseList
      keys={tags}
      table={tagsTable}
      withSelectedKeys
    />
  </div>
);

export default Tags;
