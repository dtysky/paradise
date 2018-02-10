/**
 * Copyright(c) dtysky<dtysky@outlook.com>
 * Created: 12 Jan 2018
 * Description:
 */
import * as React from 'react';
import PropTypes from 'prop-types';
import {Route, Switch, Redirect, withRouter} from 'react-router-dom';
import * as cx from 'classnames';

import config from './config';
import Sidebar from './Sidebar';

import './base.scss';

interface IStateTypes {
  current: string;
}

class App extends React.Component<any, IStateTypes> {
  public state: IStateTypes = {
    current: config[0].name
  };

  public componentWillMount() {

  }

  public render() {
    return (
      <React.Fragment>
        <Sidebar current={this.state.current} />
        <Switch>
          {
            config.map(({name, component}) => (
              <Route key={name} path={`/${name}`} component={component} />
            ))
          }
          <Route render={() => (<Redirect to={`/${config[0].name}`} />)} />
        </Switch>
      </React.Fragment>
    );
  }
}

export default withRouter<any>(App);

interface IFunc {
  (): void;
  <T>(x: T): T;
}

const func: IFunc = function<T>(x?: T) {
  if (typeof x === 'number') {
    return 1;
  }

  if (typeof x === 'string') {
    return '1';
  }
};
