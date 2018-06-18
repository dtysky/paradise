/**
 * @File   : index.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : {DATE}
 * @Link: dtysky.moe
 */
import {TEffect} from '../../types';
import {IControlOptions} from './types';

const info = require('./readme.md');

const effect: TEffect<IControlOptions> = {
  name: '{NAME}',
  path: '{ROUTE}',
  desc: '{DESC}',
  tags: [{TAGS}],
  cover: require('./cover.jpg'),
  info,
  date: '{DATE}',
  getComponent: () => import('./component'),
  getController: () => import('./controller')
};

export default effect;
