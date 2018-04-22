/**
 * @File   : Controller.tsx
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 2018-4-13 13:32:58
 * @Link: dtysky.moe
 */
import * as React from 'react';
import Button from 'antd/es/button';
import 'antd/es/button/style/css';
import Switch from 'antd/es/switch';
import 'antd/es/switch/style/css';
import Radio from 'antd/es/radio';
import 'antd/es/radio/style/css';

import {IControlOptions} from './types';
import {SliderWithInput} from '../../components';

interface IPropTypes {
  handleChangeOptions: (options: IControlOptions) => void;
}

interface IStateTypes extends IControlOptions {}

export default class extends React.PureComponent<IPropTypes, IStateTypes> {
  public state: IStateTypes = {
    replay: false,
    speed: 1,
    reverse: false,
    quality: 'high',
    loop: false
  };

  public componentDidMount() {
    this.props.handleChangeOptions(this.state);
  }

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
      <React.Fragment>
        <Button
          onClick={() => {
            this.handleSetState({replay: true});
            setTimeout(
              () => this.handleSetState({replay: false}),
              10
            );
          }}
        >
          Replay
        </Button>
        <h4>Speed</h4>
        <SliderWithInput
          min={0}
          max={4}
          step={1}
          value={this.state.speed}
          onChange={speed => this.handleSetState({speed})}
        />
        <h4>Quality</h4>
        <Radio.Group
          onChange={event => this.handleSetState({quality: event.target.value})}
          value={this.state.quality}
        >
          <Radio value={'high'}>High</Radio>
          <Radio value={'medium'}>Medium</Radio>
          <Radio value={'low'}>Low</Radio>
        </Radio.Group>
        <h4>Reverse</h4>
        <Switch
          onChange={reverse => {
            this.handleSetState({reverse});
          }}
          checked={this.state.reverse}
        />
        <h4>Loop</h4>
        <Switch
          onChange={loop => {
            this.handleSetState({loop});
          }}
          checked={this.state.loop}
        />
      </React.Fragment>
    );
  }
}
