/**
 * @File   : index.tsx
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 2018-06-18T16:00:00.000Z
 * @Description: Controller.
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
    duration: 3,
    speed: 1,
    count: 30,
    edgeTime1: 1 / 4,
    edgeTime2: 3 / 4,
    spacing: .6
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
        <h4>Count of particles</h4>
        <Slider
          min={20}
          max={60}
          step={2}
          onChange={value => this.handleSetState({count: value as number})}
          value={this.state.count}
        />
        <h4>Duration of one life cycle</h4>
        <Slider
          min={3}
          max={10}
          step={1}
          onChange={value => this.handleSetState({duration: value as number})}
          value={this.state.duration}
        />
        <h4>Speed</h4>
        <Slider
          min={.5}
          max={2}
          step={.1}
          onChange={value => this.handleSetState({speed: value as number})}
          value={this.state.speed}
        />
        <h4>Spacing between each particle</h4>
        <Slider
          min={.1}
          max={1}
          step={.1}
          onChange={value => this.handleSetState({spacing: value as number})}
          value={this.state.spacing}
        />
        <h4>when a particle is appeared</h4>
        <Slider
          min={0}
          max={.5}
          step={.05}
          onChange={value => this.handleSetState({edgeTime1: value as number})}
          value={this.state.edgeTime1}
        />
        <h4>when a particle is going to disappeared</h4>
        <Slider
          min={.5}
          max={1}
          step={.05}
          onChange={value => this.handleSetState({edgeTime2: value as number})}
          value={this.state.edgeTime2}
        />
      </div>
    );
  }
}
