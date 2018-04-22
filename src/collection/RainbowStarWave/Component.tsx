/**
 * @File   : RainbowStarWave.tsx
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 2018-4-8 12:11:56
 * @Link: dtysky.moe
 */
import * as React from 'react';

import {IControlOptions} from './types';
import './base.scss';

function createArray(size: number) {
  const array = new Array(size);
  return array.join(',').split(',');
}

const Component = (props: IControlOptions) => (
  <div className={'pd-rainbow-star-wave'}>
    {
      (createArray(props.waves)).map((item, index) => (
        <div key={index} className={'wave'}>
          {
            (createArray(props.lines).map((item2, index2) => (
              <div key={index2} className={'line'}>
                <div className={'dot'} />
              </div>
            )))
          }
        </div>
      ))
    }
  </div>
);

export default Component;
