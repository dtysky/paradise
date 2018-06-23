/**
 * @File   : utils.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 2018-6-19 14:44:20
 * @Description:
 */
import * as d3Ease from 'd3-ease';

export function generateRandom(start: number, end: number) {
  const random = Math.random();

  return (end - start) * random + start;
}

export function customInOut (
  duration: number,
  point1: number,
  point2: number,
  current: number
): number {
  if (current < point1) {
    return d3Ease.easeQuadIn(current / point1) / 2;
  } else if (current < point2) {
    return .5;
  }

  return d3Ease.easeQuadOut((current - point2) / (duration - point2)) / 2 + .5;
}
