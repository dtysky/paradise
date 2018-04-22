/**
 * @File   : SliderWithInput.tsx
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 2018-4-8 15:29:20
 * @Link: dtysky.moe
 */
import * as React from 'react';
import Slider from 'antd/es/slider';
import 'antd/es/slider/style/css';
import InputNumber from 'antd/es/input-number';
import 'antd/es/input-number/style/css';
import Row from 'antd/es/row';
import 'antd/es/row/style/css';
import Col from 'antd/es/col';
import 'antd/es/col/style/css';

interface IPropTypes {
  value: number;
  onChange: (value: number) => void;
  max?: number;
  min?: number;
  step?: number;
}

const SliderWithInput = (props: IPropTypes) => (
  <Row>
    <Col span={12}>
      <Slider
        min={props.min}
        max={props.max}
        onChange={props.onChange}
        value={props.value} />
    </Col>
    <Col span={4}>
      <InputNumber
        min={props.min}
        max={props.max}
        style={{marginLeft: 16}}
        value={props.value}
        onChange={props.onChange}
      />
    </Col>
  </Row>
);

export default SliderWithInput;
