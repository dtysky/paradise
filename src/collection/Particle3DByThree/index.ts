/**
 * @File   : index.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : Sun Jun 24 2018
 * @Link: dtysky.moe
 */
import {TEffect} from '../../types';
import {IControlOptions} from './types';

const effect: TEffect<IControlOptions> = {
  name: 'Particle3DByThree',
  path: 'particle-3d-by-three',
  desc: 'Some particles.',
  tags: ['3D', 'Particle', 'WebGL'],
  cover: require('./cover.jpg'),
  date: 'Sun Jun 24 2018',
  asyncModule: () => import('./asyncModule')
};

export default effect;
