/**
 * @File   : index.tsx
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 2018-4-18 19:29:03
 * @Link: dtysky.moe
 */
import * as React from 'react';
import {Link, withRouter, RouteComponentProps} from 'react-router-dom';
import * as cx from 'classnames';
import Checkbox from 'antd/es/checkbox';
import 'antd/es/checkbox/style/css';
import Icon from 'antd/es/icon';
import 'antd/es/icon/style/css';

import {stringAsHueToHSLToRGB} from '../../utils';
import {TRouteItem} from '../../routes/types';

import './base.scss';

interface IPropTypes extends RouteComponentProps<{}> {
  keys: string[];
  table: {[key: string]: TRouteItem[]};
  key2name?: (key: string) => string;
  withSelectedKeys?: boolean;
  defaultSelectedKeys?: string[];
}

interface IStateTypes {
  selectedKeys: string[];
}

class BaseList extends React.Component<IPropTypes, IStateTypes> {
  public state: IStateTypes = {
    selectedKeys: []
  };
  private preSearch: string = '';

  public componentDidMount() {
    if (!this.props.withSelectedKeys) {
      this.setState({selectedKeys: this.props.keys});
      return;
    }

    if (this.props.defaultSelectedKeys) {
      this.setState({selectedKeys: this.props.defaultSelectedKeys});
      return;
    }

    this.initKeys(this.props);
  }

  public componentWillReceiveProps(nextProps: IPropTypes) {
    this.initKeys(nextProps);
  }

  private initKeys(props: IPropTypes) {
    const search = props.location.search.replace(/\?/g, '');

    if (search && this.preSearch !== search) {
      const selectedKeys = search.split('&').filter(param => this.props.keys.indexOf(param) > -1);

      if (selectedKeys.length > 0) {
        this.preSearch = search;
        this.setState({selectedKeys});
        return;
      }
    }

    this.setState({selectedKeys: this.props.keys.slice(0, 5)});
  }

  private handleSelect = (values: string[]) => {
    this.setState({selectedKeys: values});
  }

  public render() {
    return (
      <React.Fragment>
        {this.renderKeys()}
        {this.state.selectedKeys.map((category, index) => this.renderCategory(category, index))}
      </React.Fragment>
    );
  }

  private renderKeys() {
    if (!this.props.withSelectedKeys) {
      return;
    }

    const key2name = this.props.key2name ? this.props.key2name : value => value;

    return (
      <Checkbox.Group
        className={cx('pd-list-keys')}
        options={this.props.keys.map(key => ({value: key, label: key2name(key)}))}
        value={this.state.selectedKeys}
        onChange={this.handleSelect}
      />
    );
  }

  private renderCategory(category: string, index: number) {
    const name = this.props.key2name ? this.props.key2name(category) : category;
    const themeColor = stringAsHueToHSLToRGB(name, 50, 60);

    return (
      <div
        key={category}
        className={cx(
          'pd-list-category',
          `pd-list-category-${index % 2 === 0 ? 'one' : 'two'}`
        )}
      >
        <h2
          className={cx('pd-list-category-title')}
          style={{
            color: themeColor,
            borderBottom: `3px solid ${themeColor}`
          }}
        >
          {name}
        </h2>
        <div className={cx('pd-list-category-list')}>
          {
            this.props.table[category].map(item => this.renderItem(themeColor, item))
          }
        </div>
      </div>
    );
  }

  private renderItem(themeColor: string, item: TRouteItem) {
    return (
      <div
        key={item.path}
        className={cx('pd-list-category-item')}
        style={{boxShadow: `0 2px 12px ${themeColor}`}}
      >
        <Link
          to={`/effect/${item.path}`}
          className={cx('pd-list-category-item-cover')}
          style={{backgroundImage: `url(${item.cover})`}}
        />
        <div className={cx('pd-list-category-item-info')}>
          <h3 className={cx('pd-list-category-item-title')}>{item.name}</h3>
          <p className={cx('pd-list-category-item-desc')}>
            {item.desc}
          </p>
          <a
            className={cx('pd-list-category-item-author')}
            href={`mailto:${item.author.email}`}
            target={'_blank'}
          >
            <Icon type={'user'} />
            {item.author.name}
          </a>
          <p className={cx('pd-list-category-item-date')}>
            <Icon type={'calendar'} />
            {item.date.toDateString()}
          </p>
          <p className={cx('pd-list-category-item-tags')}>
            <Icon type={'tags-o'} />
            {
              item.tags.map(tag => (
                <Link
                  key={tag}
                  to={`/tags?${tag}`}
                  className={cx('pd-list-category-item-tag')}
                >
                  {tag}
                </Link>
              ))
            }
          </p>
        </div>
      </div>
    );
  }
}

export default withRouter(BaseList);
