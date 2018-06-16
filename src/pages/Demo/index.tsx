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
import {TEffect} from '../../types';

import './base.scss';

interface IPropTypes extends TEffect<any> {}

interface IStateTypes {
  openInfo: boolean;
  openController: boolean;
  openTools: boolean;
  options: any;
}

export default class View extends React.PureComponent<IPropTypes, IStateTypes> {
  public state: IStateTypes = {
    openInfo: false,
    openController: false,
    openTools: false,
    options: {}
  };

  private openSidebar = (pair: {[name: string]: boolean}) => {
    this.setState({
      openInfo: false,
      openTools: false,
      ...pair
    });
  }

  public render() {
    return (
      <div className={cx('pd-view')}>
        {this.renderMain()}
        {this.renderTopbar()}
        {this.renderInfo()}
        {this.renderTools()}
        {this.renderController()}
      </div>
    );
  }

  private renderTopbar() {
    return (
      <div className={cx('pd-demo-topbar')}>
        <a
          href={this.props.code}
          className={cx('pd-demo-title')}
        >
           <h1>{this.props.name}</h1>
          <Icon type={'link'} />
        </a>
        {this.renderActions()}
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
          onClick={() => this.openSidebar({openInfo: !this.state.openInfo})}
        >
          <Icon type={'info-circle-o'} />
          <p>Details</p>
        </div>
        <div
          className={cx('pd-demo-action')}
          onClick={() => this.openSidebar({openTools: !this.state.openTools})}
        >
          <Icon type={'mobile'} />
          <p>Tools</p>
        </div>
        <div
          className={cx('pd-demo-action')}
          onClick={() => this.setState({openController: !this.state.openController})}
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

  private renderInfo() {
    return (
      <SideBar
        title={'Details'}
        icon={'file-text'}
        open={this.state.openInfo}
        onClose={() => this.setState({openInfo: false})}
      >
        <Markdown markdown={this.props.info} />
      </SideBar>
    );
  }

  private renderTools() {
    return (
      <SideBar
        title={'Tools'}
        icon={'mobile'}
        open={this.state.openTools}
        onClose={() => this.setState({openTools: false})}
      >
        <Markdown markdown={this.props.info} />
      </SideBar>
    );
  }

  private renderController() {
    const {
      Controller
    } = this.props;

    return (
      <SideBar
        title={'Setting'}
        icon={'setting'}
        direction={'right'}
        open={this.state.openController}
        onClose={() => this.setState({openController: false})}
      >
        <Controller handleChangeOptions={options => this.setState({options})} />
      </SideBar>
    );
  }
}
