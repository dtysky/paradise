/**
 * @File   : index.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : Sat Sep 08 2018
 * @Link: dtysky.moe
 */
import {TEffect} from '../../types';
import {IControlOptions} from './types';

const effect: TEffect<IControlOptions> = {
  name: 'RimLightFresnel',
  path: 'rim-light-fresnel',
  desc: '轮廓边缘照明-菲涅尔反射。',
  tags: ['Shader', 'Rim', 'Light', 'Fresnel'],
  cover: require('./cover.jpg'),
  date: 'Sat Sep 08 2018',
  asyncModule: () => import('./asyncModule')
};

export default effect;
