/**
 * @File   : index.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 2018-4-13 13:33:05
 * @Link: dtysky.moe
 */
import {TEffect} from '../../types';
import {IControlOptions} from './types';

const effect: TEffect<IControlOptions> = {
  name: 'LottieHelloWorld',
  path: 'lottie-hello-world',
  desc: 'A simple lottie demo.',
  tags: ['Lottie', 'SVG'],
  cover: require('./cover.jpg'),
  date: '2018/04/13',
  asyncModule: () => import('./asyncModule')
};

export default effect;
