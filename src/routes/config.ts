/**
 * @File   : config.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 2018-4-4 16:58:20
 * @Link: dtysky.moe
 */
import {TRouteSource} from './types';
import RainbowStarWave from '../collection/RainbowStarWave';
import TreesGenerator2D from '../collection/TreesGenerator2D';
import DigitalClock3D from '../collection/DigitalClock3D';
import LottieHelloWorld from '../collection/LottieHelloWorld';

const config: TRouteSource[] = [
  RainbowStarWave,
  TreesGenerator2D,
  DigitalClock3D,
  LottieHelloWorld
];

export default config;
