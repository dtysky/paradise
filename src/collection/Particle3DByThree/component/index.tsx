/**
 * @File   : index.tsx
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 2018-06-18T16:00:00.000Z
 * @Description: Component.
 */
import * as React from 'react';
import * as cx from 'classnames';
import * as THREE from 'three';
import * as OrbitControlsOrigin from 'three-orbit-controls';
const OrbitControls = OrbitControlsOrigin(THREE);

import {IControlOptions} from '../types';
import ParticleSystem from './ParticleSystem';
import './base.scss';

export default class Component extends React.Component<IControlOptions, {}> {
  private container: React.RefObject<HTMLCanvasElement> = React.createRef();
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private cameraController: any;
  private renderer: THREE.WebGLRenderer;
  private clock: THREE.Clock;
  private particleSystem: ParticleSystem;

  public componentDidMount() {
    const dom = this.container.current;

    dom.style.width = `${window.innerWidth}px`;
    dom.style.height = `${window.innerHeight}px`;

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.container.current,
      antialias: true
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    this.clock = new THREE.Clock();

    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x844FFF);

    this.camera = new THREE.PerspectiveCamera(80, window.innerWidth / window.innerHeight, .01, 100);
    this.cameraController = new OrbitControls(this.camera, this.renderer.domElement);
    this.camera.position.set(0, 0, 5);
    this.camera.lookAt(new THREE.Vector3(0, 0, 0));
    this.scene.add(this.camera);

    this.particleSystem = new ParticleSystem(this.scene);

    window.addEventListener('resize', this.handleResize);

    this.handleResize();
    this.clock.start();
    this.loop();
  }

  public componentWillReceiveProps(nextProps: IControlOptions) {
    let modified = false;

    Object.keys(nextProps).forEach(key => {
      if (this.props[key] !== nextProps[key]) {
        modified = true;
        return;
      }
    });

    if (modified) {
      this.particleSystem.init(nextProps);
      this.particleSystem.play();
    }
  }

  private handleResize = () => {
    const width = window.innerWidth;
    const height = window.innerHeight;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(width, height);
  }

  public loop = () => {
    this.particleSystem.update(this.clock.getDelta());

    this.renderer.render(this.scene, this.camera);

    requestAnimationFrame(this.loop);
  }

  public render() {
    return (
      <div className={cx('pd-shunguang-dty-3d-particle-by-three')}>
        <canvas
          ref={this.container}
        />
      </div>
    );
  }
}
