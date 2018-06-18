/**
 * @File   : index.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 2018-4-11 15:05:06
 * @Link: dtysky.moe
 */
import {TEffect} from '../../types';
import {IControlOptions} from './types';

const effect: TEffect<IControlOptions> = {
  name: 'DigitalClock3D',
  path: 'digital-clock-3d',
  desc: 'A 3d digital clock.',
  tags: ['WebGL', '3D', 'Three', 'Clock'],
  cover: require('./cover.jpg'),
  date: '2018/04/11',
  asyncModule: () => import('./asyncModule')
};

export default effect;
