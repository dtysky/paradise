/**
 * @File   : index.tsx
 * @Author : dtysky(dtysky@outlook.com)
 * @Date   : 2018-06-20T16:00:00.000Z
 * @Description: Component.
 */
import * as React from 'react';
import * as cx from 'classnames';
import * as THREE from 'three';

import {IControlOptions} from '../types';
import DeviceOrientationManager from 'device-orientation-manager';
import './base.scss';

interface IStateTypes {
  yaw: number;
  pitch: number;
  roll: number;
  orientation: number;
}

const doManager: DeviceOrientationManager = new DeviceOrientationManager();

const zee = new THREE.Vector3(0, 0, 1);
const screenTransform = new THREE.Quaternion();
const worldTransform = new THREE.Quaternion(-Math.sqrt(0.5), 0, 0, Math.sqrt(0.5));
const euler = new THREE.Euler();
euler.order = doManager.current.order;

export default class Component extends React.Component<IControlOptions, IStateTypes> {
  public state: IStateTypes = {
    yaw: 0,
    pitch: 0,
    roll: 0,
    orientation: 0
  };
  private container: React.RefObject<HTMLCanvasElement> = React.createRef();
  private renderer: THREE.WebGLRenderer;
  private camera: THREE.PerspectiveCamera;
  private scene: THREE.Scene;
  private mesh: THREE.Mesh;

  public async componentDidMount() {
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      canvas: this.container.current
    });

    this.camera = new THREE.PerspectiveCamera(
      80,
      window.innerWidth / window.innerHeight,
      1000,
      .1
    );

    const scene = this.scene = new THREE.Scene();
    scene.background = new THREE.Color(.4, .4, .4);

    this.initDo();

    window.addEventListener('resize', this.handleResize);
    this.handleResize();

    this.run();
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
      this.camera.quaternion.setFromEuler(euler);
      this.camera.quaternion.multiply(worldTransform);
      this.camera.quaternion.multiply(screenTransform.setFromAxisAngle(zee, -orientation));
    });
    doManager.start();
  }

  private async initMesh(src: string) {
    if (this.mesh) {
      this.scene.remove(this.mesh);
    }

    const loader = new THREE.TextureLoader();
    const skybox = await loader.load(src);

    const geometry = new THREE.SphereGeometry(4, 64, 32);
    const material = new THREE.MeshBasicMaterial({
      map: skybox,
      side: THREE.BackSide
    });
    const mesh = this.mesh = new THREE.Mesh(geometry, material);
    this.scene.add(mesh);
  }

  private handleResize = () => {
    const {innerWidth: width, innerHeight: height} = window;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(width, height);
  }

  private run = () => {
    this.renderer.render(this.scene, this.camera);
    requestAnimationFrame(this.run);
  }

  public render() {
    return (
      <div className={cx('pd-shunguang-dty-device-orientation')}>
        <canvas ref={this.container} />
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
