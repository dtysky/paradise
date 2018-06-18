/**
 * @File   : index.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : Sat Jun 16 2018
 * @Link: dtysky.moe
 */
import {TEffect} from '../../types';
import {IControlOptions} from './types';

const effect: TEffect<IControlOptions> = {
  name: 'PixelDisplacement2D',
  path: 'pixel-displacement-2d',
  desc: '2d pixel displacement mapping.',
  tags: ['WebGL', 'Shader'],
  cover: require('./cover.jpg'),
  date: 'Sat Jun 16 2018',
  asyncModule: () => import('./asyncModule')
};

export default effect;
