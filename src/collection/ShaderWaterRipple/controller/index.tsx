/**
 * @File   : Controller.tsx
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : {TIME}
 * @Link: dtysky.moe
 */
import * as React from 'react';
import Button from 'antd/es/button';
import 'antd/es/button/style/css';
import Input from 'antd/es/input';
import 'antd/es/input/style/css';
import Slider from 'antd/es/slider';
import 'antd/es/slider/style/css';
import Upload from 'antd/es/upload';
import 'antd/es/upload/style/css';
import {UploadFile} from 'antd/es/upload/interface';

import {IControlOptions} from '../types';

interface IPropTypes {
  handleChangeOptions: (options: IControlOptions) => void;
}

interface IStateTypes extends IControlOptions {
  defaultMap: 'wave' | 'circle' | 'chess';
}

export default class Controller extends React.PureComponent<IPropTypes, IStateTypes> {
  public state: IStateTypes = {
    defaultMap: 'wave',
    image: 'assets/image.jpg',
    radius: .3,
    life: 2,
    band: .3,
    amp: 0.3,
    waves: 12,
    speed: 2
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

  private handleFileUpload = (info: {file: File}, key: 'image' | 'map') => {
    const {file} = info;
    const url = URL.createObjectURL(file);

    (this as any).setState({[key]: url});
  }

  private handleFileRemove = (file: UploadFile, key: 'image' | 'map') => {
    URL.revokeObjectURL(this.state[key]);
  }

  private handleOk = () => {
    this.changeOptions();
  }

  public render() {
    return (
      <div>
        {this.renderUpload('Image', 'image')}
        <h4>radius</h4>
        <Slider
          min={.1}
          max={1}
          step={.1}
          onChange={value => this.handleSetState({radius: value as number})}
          value={this.state.radius}
        />
        <h4>life</h4>
        <Slider
          min={.5}
          max={4}
          step={.1}
          onChange={value => this.handleSetState({life: value as number})}
          value={this.state.life}
        />
        <h4>wave band</h4>
        <Slider
          min={.1}
          max={.9}
          step={.1}
          onChange={value => this.handleSetState({band: value as number})}
          value={this.state.band}
        />
        <h4>amplitude</h4>
        <Slider
          min={.02}
          max={1}
          step={.02}
          onChange={value => this.handleSetState({amp: value as number})}
          value={this.state.amp}
        />
        <h4>waves</h4>
        <Slider
          min={4}
          max={20}
          step={1}
          onChange={value => this.handleSetState({waves: value as number})}
          value={this.state.waves}
        />
        <h4>speed</h4>
        <Slider
          min={.5}
          max={20}
          step={.5}
          onChange={value => this.handleSetState({speed: value as number})}
          value={this.state.speed}
        />
      </div>
    );
  }

  private renderUpload(title: string, key: 'image' | 'map') {
    return (
      <React.Fragment>
        <h4>{title}</h4>
        <div style={{display: 'flex'}}>
          <Input
            value={this.state[key]}
            onChange={({target}) => this.handleSetState({[key]: target.value})}
            style={{marginRight: 12}}
          />
          <Upload
            accept={'image/*'}
            action={''}
            customRequest={info => this.handleFileUpload(info, key)}
            onRemove={file => this.handleFileRemove(file, key)}
            showUploadList={false}
          >
          <Button style={{marginRight: 12}}>
            Upload
          </Button>
          </Upload>
          <Button onClick={this.handleOk}>
            OK
          </Button>
        </div>
      </React.Fragment>
    );
  }
}
