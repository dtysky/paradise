/**
 * Copyright(c) dtysky<dtysky@outlook.com>
 * Created: 17 Jan 2018
 * Description:
 */
import * as React from 'react';
import {Link} from 'react-router-dom';
import * as cx from 'classnames';

import config from './config';

interface IPropTypes {
  current: string
}

interface IStateTypes {
  open: boolean;
}

export default class Sidebar extends React.PureComponent<IPropTypes, IStateTypes> {
  public state: IStateTypes = {
    open: false
  };

  public render() {
    return (
      <React.Fragment>
        <div
          className={cx('pd-menu')}
          onClick={() => this.setState({open: !this.state.open})}
        />
        <div className={cx(
          'pd-sidebar',
          this.state.open && 'pd-sidebar-open'
        )}>
          {
            config.map(({name}) => (
              <Link
                key={name}
                className={cx(
                  'pd-sidebar-option',
                  name === this.props.current && 'pd-sidebar-active'
                )}
                to={`/${name}`}
              >
                {name}
              </Link>
            ))
          }
        </div>
      </React.Fragment>
    );
  }
}
