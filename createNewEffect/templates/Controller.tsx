/**
 * @File   : Controller.tsx
 * @Author : {AUTHOR}
 * @Date   : {TIME}
 * @Link: dtysky.moe
 */
import * as React from 'react';

import {IControlOptions} from './types';

interface IPropTypes {
  handleChangeOptions: (options: IControlOptions) => void;
}

interface IStateTypes extends IControlOptions {}

export default class extends React.PureComponent<IPropTypes, IStateTypes> {
  public state: IStateTypes = {};

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
      <div>
        
      </div>
    );
  }
}
