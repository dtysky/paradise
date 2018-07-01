/**
 * @File   : index.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : Sun Jul 01 2018
 * @Link: dtysky.moe
 */
import {TEffect} from '../../types';
import {IControlOptions} from './types';

const effect: TEffect<IControlOptions> = {
  name: 'ShaderWaterRipple',
  path: 'shader-water-ripple',
  desc: 'Water ripple by shader.',
  tags: ['Shader', 'Water', 'Ripple', 'WebGL'],
  cover: require('./cover.jpg'),
  date: 'Sun Jul 01 2018',
  asyncModule: () => import('./asyncModule')
};

export default effect;
