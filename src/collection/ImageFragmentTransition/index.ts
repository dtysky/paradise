/**
 * @File   : index.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : Sat Jul 21 2018
 * @Link: dtysky.moe
 */
import {TEffect} from '../../types';
import {IControlOptions} from './types';

const effect: TEffect<IControlOptions> = {
  name: 'ImageFragmentTransition',
  path: 'image-fragment-transition',
  desc: '2D image transition effect with vertex animation.',
  tags: ['WebGL', 'Shader', 'Vertex', 'Image', 'Fragment'],
  cover: require('./cover.jpg'),
  date: 'Sat Jul 21 2018',
  asyncModule: () => import('./asyncModule')
};

export default effect;
