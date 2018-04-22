/**
 * @File   : Controller.tsx
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 2018-4-10 11:58:17
 * @Link: dtysky.moe
 */
import * as React from 'react';
import Button from 'antd/es/button';
import 'antd/es/button/style/css';

import {IControlOptions} from './types';
import {SliderWithInput} from '../../components';

interface IPropTypes {
  handleChangeOptions: (options: IControlOptions) => void;
}

interface IStateTypes extends IControlOptions {}

export default class extends React.PureComponent<IPropTypes, IStateTypes> {
  public state: IStateTypes = {
    clear: false,
    MAX_AGE: 80,
    LEAF_DISTANCE: 6,
    DIAMETER: 10,
    LEAFE_SIZE: 3,
    TREE_VARIANCE: 2,
    BRANCH_VARIANCE: 30,
    DRAW_DISTANCE: 3
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
            this.handleSetState({clear: true});
            setTimeout(() => this.handleSetState({clear: false}), 10);
          }}
        >
          Clear
        </Button>
        <h4>MAX_AGE</h4>
        <SliderWithInput
          min={20}
          max={100}
          value={this.state.MAX_AGE}
          onChange={MAX_AGE => {
            this.handleSetState({MAX_AGE});
          }}
        />
        <h4>LEAF_DISTANCE</h4>
        <SliderWithInput
          min={2}
          max={10}
          value={this.state.LEAF_DISTANCE}
          onChange={LEAF_DISTANCE => {
            this.handleSetState({LEAF_DISTANCE});
          }}
        />
        <h4>DIAMETER</h4>
        <SliderWithInput
          min={4}
          max={20}
          value={this.state.DIAMETER}
          onChange={DIAMETER => {
            this.handleSetState({DIAMETER});
          }}
        />
        <h4>LEAFE_SIZE</h4>
        <SliderWithInput
          min={1}
          max={8}
          value={this.state.LEAFE_SIZE}
          onChange={LEAFE_SIZE => {
            this.handleSetState({LEAFE_SIZE});
          }}
        />
        <h4>TREE_VARIANCE</h4>
        <SliderWithInput
          min={1}
          max={5}
          value={this.state.TREE_VARIANCE}
          onChange={TREE_VARIANCE => {
            this.handleSetState({TREE_VARIANCE});
          }}
        />
        <h4>BRANCH_VARIANCE</h4>
        <SliderWithInput
          min={20}
          max={60}
          value={this.state.BRANCH_VARIANCE}
          onChange={BRANCH_VARIANCE => {
            this.handleSetState({BRANCH_VARIANCE});
          }}
        />
        <h4>DRAW_DISTANCE</h4>
        <SliderWithInput
          min={1}
          max={8}
          value={this.state.DRAW_DISTANCE}
          onChange={DRAW_DISTANCE => {
            this.handleSetState({DRAW_DISTANCE});
          }}
        />
      </React.Fragment>
    );
  }
}
