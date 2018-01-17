/**
 * Copyright(c) dtysky<dtysky@outlook.com>
 * Created: 12 Jan 2018
 * Description:
 */
import * as React from 'react';

import './bass.scss';

export default class RainbowStarWave extends React.Component<any, any> {
  public render() {
    return (
      <div className={'pd-rainbow-star-wave'}>
        {
          (new Array(4)).fill(0).map((item, index) => (
            <div key={index} className={'wave'}>
              {
                (new Array(50)).fill(0).map((item2, index2) => (
                  <div key={index2} className={'line'}>
                    <div className={'dot'} />
                  </div>
                ))
              }
            </div>
          ))
        }
      </div>
    );
  }
};
