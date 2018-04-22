/**
 * @File   : index.tsx
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 2018-4-18 19:05:10
 * @Link: dtysky.moe
 */
import * as React from 'react';
import * as cx from 'classnames';
import {Link} from 'react-router-dom';
import Icon from 'antd/es/icon';
import 'antd/es/icon/style/css';

import {Markdown, SideBar} from '../../components';
import {TRouteItem} from '../../routes/types';

import './base.scss';

interface IPropTypes extends TRouteItem {}

interface IStateTypes {
  openInfo: boolean;
  openController: boolean;
  options: any;
}

export default class View extends React.PureComponent<IPropTypes, IStateTypes> {
  public state: IStateTypes = {
    openInfo: false,
    openController: false,
    options: {}
  };

  public render() {
    return (
      <div className={cx('pd-view')}>
        {this.renderMain()}
        {this.renderActions()}
        {this.renderController()}
        {this.renderInfo()}
      </div>
    );
  }

  private renderActions() {
    const {
      name
    } = this.props;

    return (
      <div className={cx('pd-demo-actions')}>
        <div
          className={cx('pd-demo-action')}
          onClick={() => this.setState({openInfo: true})}
        >
          <Icon type={'info-circle-o'} />
          <p>Details</p>
        </div>
        <div
          className={cx('pd-demo-action')}
          onClick={() => this.setState({openController: true})}
        >
          <Icon type={'setting'} />
          <p>Setting</p>
        </div>
        <Link
          to={'/'}
          className={cx('pd-demo-action')}
        >
          <Icon type={'left-circle-o'} />
          <p>Back</p>
        </Link>
      </div>
    );
  }

  private renderMain() {
    const {
      Component
    } = this.props;

    return (
      <div className={cx('pd-demo-main')}>
        <Component {...this.state.options} />
      </div>
    );
  }

  private renderController() {
    const {
      Controller
    } = this.props;

    return (
      <SideBar
        title={'Setting'}
        open={this.state.openController}
        onClose={() => this.setState({openController: false})}
      >
        <Controller handleChangeOptions={options => this.setState({options})} />
      </SideBar>
    );
  }

  private renderInfo() {
    return (
      <SideBar
        title={this.props.name}
        open={this.state.openInfo}
        onClose={() => this.setState({openInfo: false})}
      >
        <Markdown markdown={this.props.info} />
      </SideBar>
    );
  }
}
