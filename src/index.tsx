/**
 * Copyright(c) dtysky<dtysky@outlook.com>
 * Created: 12 Jan 2018
 * Description:
 */
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {AppContainer} from 'react-hot-loader';

import './base.scss';

import Router from './Router';

const render = () => {
  ReactDOM.render(
    <AppContainer>
      <Router />
    </AppContainer>,
    document.getElementById('paradise')
  );
};

declare const module: any;
if (module.hot) {
  module.hot.accept();
  render();
} else {
  render();
}
