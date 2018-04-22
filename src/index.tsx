/**
 * @File   : index.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 2018-4-4 16:56:32
 * @Link: dtysky.moe
 */
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {BrowserRouter} from 'react-router-dom';
// import {AppContainer} from 'react-hot-loader';

import App from './App';
import './base.scss';

const render = () => {
  ReactDOM.render(
    <BrowserRouter>
      <App />
    </BrowserRouter>,
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
