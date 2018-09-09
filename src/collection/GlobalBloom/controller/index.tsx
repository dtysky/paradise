/**
 * @File   : Controller.tsx
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : {TIME}
 * @Link: dtysky.moe
 */
import * as React from 'react';
import Slider from 'antd/es/slider';
import 'antd/es/slider/style/css';

import {IControlOptions} from '../types';

interface IPropTypes {
  handleChangeOptions: (options: IControlOptions) => void;
}

interface IStateTypes extends IControlOptions {}

export default class Controller extends React.PureComponent<IPropTypes, IStateTypes> {
  public state: IStateTypes = {
    threshold: 0,
    stepSize: .002,
    toneExp: 2
  };

  public componentDidMount() {
    this.props.handleChangeOptions(this.state);
  }

  // note: using handleSetState instead of original 'setState' !
  private handleSetState = (obj: Partial<IStateTypes>) => {
    this.setState(obj as IStateTypes, () => {
      this.changeOptions();
    });
  }

  private changeOptions = () => {
    this.props.handleChangeOptions(this.state);
  }

  public render() {
    return (
      <div>
        <h4>Threshold</h4>
        <Slider
          min={0}
          max={1}
          step={.05}
          onChange={value => this.handleSetState({threshold: value as number})}
          value={this.state.threshold}
        />
        <h4>Step size</h4>
        <Slider
          min={0}
          max={.02}
          step={.001}
          onChange={value => this.handleSetState({stepSize: value as number})}
          value={this.state.stepSize}
        />
        <h4>Tone map exp</h4>
        <Slider
          min={0}
          max={10}
          step={.2}
          onChange={value => this.handleSetState({toneExp: value as number})}
          value={this.state.toneExp}
        />
      </div>
    );
  }
}
