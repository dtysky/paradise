/**
 * @File   : index.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : Sun Sep 09 2018
 * @Link: dtysky.moe
 */
import {TEffect} from '../../types';
import {IControlOptions} from './types';

const effect: TEffect<IControlOptions> = {
  name: 'GlowEmissiveMap',
  path: 'glow-emissive-map',
  desc: '基于EmissiveMap的辉光的例子。',
  tags: ['Bloom', 'Glow', 'PostProcessing', 'ImageProcessing', 'Emissive'],
  cover: require('./cover.jpg'),
  date: 'Sun Sep 09 2018',
  asyncModule: async () => {
    const THREE = await import('three');
    (window as any).THREE = THREE;

    return import('./asyncModule')
  }
};

export default effect;
