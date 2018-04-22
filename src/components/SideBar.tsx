/**
 * @File   : SideBar.tsx
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 2018-4-8 17:56:41
 * @Link: dtysky.moe
 */
import * as React from 'react';
import {createPortal} from 'react-dom';
import * as cx from 'classnames';
import Icon from 'antd/es/icon';
import 'antd/es/icon/style/css';

import './sidebar.scss';

interface IPropTypes {
  open: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}

const SideBar = (props: IPropTypes) => (
  <div>
    <div
      className={cx(
        'pd-sidebar-mask',
        !props.open && 'pd-sidebar-mask-close'
      )}
      onClick={props.onClose}
    />
    {
      createPortal(
        <div
          className={cx(
            'pd-sidebar',
            props.open && 'pd-sidebar-open'
          )}
        >
          <Icon
            type={'close'}
            className={cx('pd-sidebar-close-button')}
            onClick={props.onClose}
          />
          <h2 className={cx('pd-sidebar-title')}>{props.title}</h2>
          <div className={cx('pd-sidebar-main')}>
            {props.children}
          </div>
        </div>,
        document.body
      )
    }
  </div>
);

export default SideBar;
