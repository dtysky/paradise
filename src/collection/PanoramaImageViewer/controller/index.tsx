/**
 * @File   : index.tsx
 * @Author : dtysky(dtysky@outlook.com)
 * @Date   : 2018-06-20T16:00:00.000Z
 * @Description: Controller.
 */
import * as React from 'react';
import Input from 'antd/es/input';
import 'antd/es/input/style/css';
import Upload from 'antd/es/upload';
import 'antd/es/upload/style/css';
import Button from 'antd/es/button';
import 'antd/es/button/style/css';
import {UploadFile} from 'antd/es/upload/interface';

import {IControlOptions} from '../types';

interface IPropTypes {
  handleChangeOptions: (options: IControlOptions) => void;
}

interface IStateTypes extends IControlOptions {}

export default class Controller extends React.PureComponent<IPropTypes, IStateTypes> {
  public state: IStateTypes = {
    image: 'assets/aurora.jpg'
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

  private handleFileUpload = (info: {file: File}) => {
    const {file} = info;
    const url = URL.createObjectURL(file);

    (this as any).setState({image: url});
  }

  private handleFileRemove = (file: UploadFile) => {
    URL.revokeObjectURL(this.state.image);
  }

  private handleOk = () => {
    this.changeOptions();
  }

  public render() {
    return (
      <div>
          <h4>Upload your panorama image</h4>
          <div style={{display: 'flex'}}>
            <Input
              value={this.state.image}
              onChange={({target}) => this.handleSetState({image: target.value})}
              style={{marginRight: 12}}
            />
            <Upload
              accept={'image/*'}
              action={''}
              customRequest={info => this.handleFileUpload(info)}
              onRemove={file => this.handleFileRemove(file)}
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
      </div>
    );
  }
}
