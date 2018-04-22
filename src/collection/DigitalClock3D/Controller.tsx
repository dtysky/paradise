/**
 * @File   : Controller.tsx
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 2018-4-11 15:04:55
 * @Link: dtysky.moe
 */
import * as React from 'react';
import Button from 'antd/es/button';
import 'antd/es/button/style/css';

import {IControlOptions} from './types';

interface IPropTypes {
  handleChangeOptions: (options: IControlOptions) => void;
}

interface IStateTypes extends IControlOptions {}

export default class extends React.PureComponent<IPropTypes, IStateTypes> {
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
    return null;
  }
}
