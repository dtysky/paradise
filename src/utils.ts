/**
 * @File   : utils.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 2018-4-9 15:51:25
 * @Link: dtysky.moe
 */
import * as stringHash from 'string-hash';
import * as colorSpace from 'color-space';

export function stringAsHueToHSLToRGB(
  str: string, s: number, l: number, range: [number, number] = [0, 360]
): string {
  const h = Math.round(stringHash(str) % (range[1] - range[0])) + range[0];
  const color = colorSpace.hsl.rgb([h, s, l]).map(channel => Math.round(channel));

  return `rgb(${color.join(', ')})`;
}
