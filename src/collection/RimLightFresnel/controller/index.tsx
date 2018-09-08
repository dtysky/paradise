/**
 * @File   : Controller.tsx
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : {TIME}
 * @Link: dtysky.moe
 */
import * as React from 'react';
import * as THREE from 'three';
import Slider from 'antd/es/slider';
import 'antd/es/slider/style/css';
import Radio from 'antd/es/radio';
import 'antd/es/radio/style/css';

import {IControlOptions} from '../types';

interface IPropTypes {
  handleChangeOptions: (options: IControlOptions) => void;
}

interface IStateTypes extends IControlOptions {}

export default class Controller extends React.PureComponent<IPropTypes, IStateTypes> {
  public state: IStateTypes = {
    side: THREE.FrontSide,
    c: 1.2,
    p: 2.5
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
        <h4>Renderer</h4>
        <Radio.Group
          onChange={event => this.handleSetState({side: event.target.value})}
          value={this.state.side}
        >
          <Radio value={THREE.FrontSide}>FrontSide</Radio>
          <Radio value={THREE.BackSide}>BackSide</Radio>
          <Radio value={THREE.DoubleSide}>DoubleSide</Radio>
        </Radio.Group>
        <h4>c</h4>
        <Slider
          min={0}
          max={10}
          step={.1}
          onChange={value => this.handleSetState({c: value as number})}
          value={this.state.c}
        />
        <h4>p</h4>
        <Slider
          min={0}
          max={10}
          step={.1}
          onChange={value => this.handleSetState({p: value as number})}
          value={this.state.p}
        />
      </div>
    );
  }
}
