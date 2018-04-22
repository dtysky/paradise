/**
 * @File   : types.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 2018-4-13 13:33:21
 * @Link: dtysky.moe
 */
export interface IControlOptions {
  replay: boolean;
  speed: number;
  reverse: boolean;
  quality: 'low' | 'high' | 'medium';
  loop: boolean;
}
