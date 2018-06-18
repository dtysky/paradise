/**
 * @File   : index.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 2018-4-10 11:58:26
 * @Link: dtysky.moe
 */
import {TEffect} from '../../types';
import {IControlOptions} from './types';

const effect: TEffect<IControlOptions> = {
  name: 'TreesGenerator2D',
  path: 'trees-generator-2d',
  desc: 'Plat trees with canvas.',
  tags: ['Canvas', 'Tree'],
  cover: require('./cover.jpg'),
  date: '2018/04/10',
  asyncModule: () => import('./asyncModule')
};

export default effect;
