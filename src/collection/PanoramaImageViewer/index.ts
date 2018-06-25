/**
 * @File   : index.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : Mon Jun 25 2018
 * @Link: dtysky.moe
 */
import {TEffect} from '../../types';
import {IControlOptions} from './types';

const effect: TEffect<IControlOptions> = {
  name: 'PanoramaImageViewer',
  path: 'panorama-image-viewer',
  desc: 'Example for device orientation.',
  tags: ['WebGL', 'Panorama', 'Orientation'],
  cover: require('./cover.jpg'),
  date: 'Mon Jun 25 2018',
  asyncModule: () => import('./asyncModule')
};

export default effect;
