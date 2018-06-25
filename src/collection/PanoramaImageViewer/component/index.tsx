/**
 * @File   : index.tsx
 * @Author : dtysky(dtysky@outlook.com)
 * @Date   : 2018-06-20T16:00:00.000Z
 * @Description: Component.
 */
import * as React from 'react';
import * as cx from 'classnames';
import * as Hilo3d from 'hilo3d';

import {IControlOptions} from '../types';
import DeviceOrientationManager from './DeviceOrientationManager';
import './base.scss';

interface IStateTypes {
  yaw: number;
  pitch: number;
  roll: number;
  orientation: number;
}

const doManager: DeviceOrientationManager = new DeviceOrientationManager();

const zee = new Hilo3d.Vector3(0, 0, 1);
const q0 = new Hilo3d.Quaternion();
const q1 = new Hilo3d.Quaternion().rotateX(-Math.PI * 80 / 180);
const euler = new Hilo3d.Euler();
euler.order = doManager.current.order;

export default class Component extends React.Component<IControlOptions, IStateTypes> {
  public state: IStateTypes = {
    yaw: 0,
    pitch: 0,
    roll: 0,
    orientation: 0
  };
  private container: React.RefObject<HTMLDivElement> = React.createRef();
  private camera: Hilo3d.PerspectiveCamera;
  private stage: Hilo3d.Stage;
  private mesh: Hilo3d.Mesh;

  public async componentDidMount() {
    const camera = this.camera = new Hilo3d.PerspectiveCamera({
      aspect: window.innerWidth / window.innerHeight,
      far: 1000,
      near: .1,
      fov: 80
    });

    const stage = this.stage = new Hilo3d.Stage({
      container: this.container.current,
      camera: camera,
      clearColor: new Hilo3d.Color(.4, .4, .4),
      width: window.innerWidth,
      height: window.innerHeight
    });

    const ticker = new Hilo3d.Ticker(60);
    ticker.addTick(stage);
    ticker.addTick(Hilo3d.Tween);
    ticker.addTick(Hilo3d.Animation);
    ticker.start();

    this.initDo();

    window.addEventListener('resize', this.handleResize);
  }

  public componentWillReceiveProps(nextProps: IControlOptions) {
    if (this.props.image !== nextProps.image) {
      this.initMesh(nextProps.image);
    }
  }

  private initDo() {
    doManager.container = this.container.current;
    doManager.addEventListener('deviceorientation', ({yaw, pitch, roll, order, orientation}) => {
      this.setState({
        yaw: yaw / Math.PI * 180,
        pitch: pitch / Math.PI * 180,
        roll: roll / Math.PI * 180,
        orientation
      });

      euler.set(pitch, yaw, roll, order);
      this.camera.quaternion.fromEuler(euler);
      this.camera.quaternion.multiply(q1);
      this.camera.quaternion.multiply(q0.setAxisAngle(zee, -orientation));
    });
    doManager.start();
  }

  private async initMesh(src: string) {
    if (this.mesh) {
      this.mesh.removeFromParent();
    }

    const loader = new Hilo3d.TextureLoader();
    const skybox = await loader.load({crossOrigin: true, src});

    const geometry = new Hilo3d.SphereGeometry({
      radius: 4,
      widthSegments: 64,
      heightSegments: 32
    });
    const material = new Hilo3d.BasicMaterial({
      diffuse: skybox,
      lightType: 'NONE',
      side: Hilo3d.constants.BACK
    });
    const mesh = this.mesh = new Hilo3d.Mesh({geometry, material});
    this.stage.addChild(mesh);
  }

  private handleResize = () => {
    const {innerWidth: width, innerHeight: height} = window;

    this.camera.aspect = width / height;
    this.stage.resize(width, height);
  }

  public render() {
    return (
      <div
        className={cx('pd-shunguang-dty-device-orientation')}
        ref={this.container}
      >
        <div className={cx('pd-shunguang-dty-device-orientation-info')}>
          <p>yaw: {this.state.yaw.toFixed(4)}</p>
          <p>pitch: {this.state.pitch.toFixed(4)}</p>
          <p>roll: {this.state.roll.toFixed(4)}</p>
          <p>orientation: {this.state.orientation}</p>
        </div>
      </div>
    );
  }
}
