/**
 * @File   : index.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : Sun Sep 09 2018
 * @Link: dtysky.moe
 */
import {TEffect} from '../../types';
import {IControlOptions} from './types';

const effect: TEffect<IControlOptions> = {
  name: 'GlobalBloom',
  path: 'global-bloom',
  desc: '使用后处理实现的全局辉光。',
  tags: ['Bloom', 'Glow', 'Shader', 'PostProcessing', 'ImageProcessing'],
  cover: require('./cover.jpg'),
  date: 'Sun Sep 09 2018',
  asyncModule: () => import('./asyncModule')
};

export default effect;
