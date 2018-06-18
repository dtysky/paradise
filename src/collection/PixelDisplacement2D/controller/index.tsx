/**
 * @File   : Controller.tsx
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : {TIME}
 * @Link: dtysky.moe
 */
import * as React from 'react';
import Button from 'antd/es/button';
import 'antd/es/button/style/css';
import Radio from 'antd/es/radio';
import 'antd/es/radio/style/css';
import Input from 'antd/es/input';
import 'antd/es/input/style/css';
import Slider from 'antd/es/slider';
import 'antd/es/slider/style/css';
import Upload from 'antd/es/upload';
import 'antd/es/upload/style/css';
import {UploadFile} from 'antd/es/upload/interface';

import {IControlOptions} from '../types';

const maps = {
  wave: require('../assets/wave.png'),
  circle: require('../assets/circle.png'),
  chess: require('../assets/chess.png')
};

interface IPropTypes {
  handleChangeOptions: (options: IControlOptions) => void;
}

interface IStateTypes extends IControlOptions {
  defaultMap: 'wave' | 'circle' | 'chess';
}

export default class Controller extends React.PureComponent<IPropTypes, IStateTypes> {
  public state: IStateTypes = {
    defaultMap: 'wave',
    image: require('../assets/image.jpg'),
    map: maps.wave,
    scaleX: .02,
    scaleY: .02,
    speed: 5
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
        {this.renderUpload('Map for displacement', 'map')}
        <h4>Default maps</h4>
        <Radio.Group
          onChange={({target}) => {
            const map = target.value;
            this.handleSetState({map: maps[map], defaultMap: map});
          }}
          value={this.state.defaultMap}
        >
          <Radio value={'wave'}>wave</Radio>
          <Radio value={'circle'}>circle</Radio>
          <Radio value={'chess'}>chess</Radio>
        </Radio.Group>
        <h4>scale.x</h4>
        <Slider
          min={.01}
          max={1}
          step={.01}
          onChange={value => this.handleSetState({scaleX: value as number})}
          value={this.state.scaleX}
        />
        <h4>scale.y</h4>
        <Slider
          min={.01}
          max={1}
          step={.01}
          onChange={value => this.handleSetState({scaleY: value as number})}
          value={this.state.scaleY}
        />
        <h4>speed</h4>
        <Slider
          min={1}
          max={20}
          step={1}
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
