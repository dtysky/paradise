/**
 * @File   : Controller.tsx
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 2018-4-8 12:06:40
 * @Link: dtysky.moe
 */
import * as React from 'react';

import {SliderWithInput} from '../../components';
import {IControlOptions} from './types';

interface IPropTypes {
  handleChangeOptions: (options: IControlOptions) => void;
}

interface IStateTypes extends IControlOptions {}

export default class extends React.PureComponent<IPropTypes, IStateTypes> {
  public state: IStateTypes = {
    waves: 4,
    lines: 40
  };

  public componentDidMount() {
    this.props.handleChangeOptions(this.state);
  }

  private changeOptions = () => {
    this.props.handleChangeOptions(this.state);
  }

  public render() {
    return (
      <React.Fragment>
        <h4>Waves</h4>
        <SliderWithInput
          min={1}
          max={10}
          value={this.state.waves}
          onChange={waves => {
            this.setState({waves}, this.changeOptions);
          }}
        />
        <h4>Lines</h4>
        <SliderWithInput
          min={10}
          max={100}
          value={this.state.lines}
          onChange={lines => {
            this.setState({lines}, this.changeOptions);
          }}
        />
      </React.Fragment>
    );
  }
}
