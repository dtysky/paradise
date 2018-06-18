/**
 * @File   : index.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : {DATE}
 * @Link: dtysky.moe
 */
import {TEffect} from '../../types';
import {IControlOptions} from './types';

const effect: TEffect<IControlOptions> = {
  name: '{NAME}',
  path: '{ROUTE}',
  desc: '{DESC}',
  tags: [{TAGS}],
  cover: require('./cover.jpg'),
  date: '{DATE}',
  asyncModule: () => import('./asyncModule')
};

export default effect;
