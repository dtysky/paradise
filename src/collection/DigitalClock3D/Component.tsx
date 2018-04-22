/**
 * @File   : Component.tsx
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 2018-4-11 15:04:45
 * @Link: dtysky.moe
 */
import * as React from 'react';
import * as cx from 'classnames';
import {
  Scene, WebGLRenderer, PCFSoftShadowMap, SphereGeometry,
  Texture, MeshBasicMaterial, Mesh, PerspectiveCamera,
  AmbientLight, DirectionalLight, Vector3, DoubleSide
} from 'three';
import * as THREE from 'three';
;import * as OrbitControlsOrigin from 'three-orbit-controls';
const OrbitControls = OrbitControlsOrigin(THREE);

import {IControlOptions} from './types';
import ClockNumber from './ClockNumber';
import ClockDot from './ClockDot';
import './base.scss';

export default class Component extends React.Component<IControlOptions, {}> {
  private container: HTMLDivElement;
  private renderer: WebGLRenderer;
  private scene: Scene;
  private screen: {
    top: number,
    left: number,
    width: number,
    height: number
  };
  private size: {
    width: number;
    height: number;
    depth: number;
  };
  private rafId = null;
  private camera: PerspectiveCamera;
  private cameraController: any;
  private numbers: [ClockNumber, ClockNumber, ClockNumber, ClockNumber, ClockNumber, ClockNumber];
  private dots: [ClockDot, ClockDot];
  private date: Date;

  public componentDidMount() {
    this.screen = {
      top: 0,
      left: 0,
      width: window.innerWidth,
      height: window.innerHeight
    };

    this.size = {
      width: 40,
      height: 20,
      depth: 100
    };

    const {
      width,
      height
    } = this.screen;

    this.scene = new Scene();
    this.renderer = new WebGLRenderer({antialias: true});
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(width, height);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = PCFSoftShadowMap;
    this.container.appendChild(this.renderer.domElement);

    this.initLight();
    this.initSky();
    this.initCamera();
    this.initClock();

    window.addEventListener('resize', this.handleResize);
    
    this.handleResize();
    this.run();
  }

  public componentWillUnmount() {
    cancelAnimationFrame(this.rafId);
    this.container.removeChild(this.container.firstChild);
    window.removeEventListener('resize', this.handleResize);
  }

  private initSky() {
    const {width, height, depth} = this.size;

    const radius = new Vector3(0, 0, 0).distanceTo(
      new Vector3(width, height, depth)
    ) * 1;
    const skyBoxGeometry = new SphereGeometry(radius, 32, 32);
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const context = canvas.getContext('2d');
    context.beginPath();
    context.rect(0, 0, 512, 512);
    context.fillStyle = '#80bbd1';
    context.fill();
    const texture = new Texture(canvas);
    texture.needsUpdate = true;
    const skyBox = new Mesh(skyBoxGeometry, new MeshBasicMaterial({map: texture}));
    (skyBox.material as any).side = DoubleSide;
    this.scene.add(skyBox);
  }

  private initLight() {
    const lightLeft = new DirectionalLight(0xffffff, 1);
    lightLeft.position.set(-15, this.size.height * .8, 10);
    lightLeft.lookAt(new Vector3(0, 0, 0));
    lightLeft.castShadow = true;
    this.scene.add(lightLeft);

    const lightRight = new DirectionalLight(0xffffff, 1);
    lightRight.position.set(15, this.size.height * .8, 10);
    lightRight.lookAt(new Vector3(0, 0, 0));
    lightRight.castShadow = true;
    this.scene.add(lightRight);
  }

  private initCamera() {
    const {width, height, depth} = this.size;
    const maxDistance = new Vector3(0, 0, 0).distanceTo(
      new Vector3(width, height, depth)
    ) * 2;

    this.camera = new PerspectiveCamera(
      50, width / height, 0.01, maxDistance
    );
    this.cameraController = new OrbitControls(this.camera, this.renderer.domElement);
    this.camera.position.set(-5, 5, 34);
    this.camera.lookAt(new Vector3(0, 0, 0));
  }

  private initClock() {
    this.numbers = [
      new ClockNumber(this.scene, new Vector3(-14, 0, 0)),
      new ClockNumber(this.scene, new Vector3(-10, 0, 0)),
      new ClockNumber(this.scene, new Vector3(-2, 0, 0)),
      new ClockNumber(this.scene, new Vector3(2, 0, 0)),
      new ClockNumber(this.scene, new Vector3(10, 0, 0)),
      new ClockNumber(this.scene, new Vector3(14, 0, 0))
    ];

    this.dots = [
      new ClockDot(this.scene, new Vector3(-6, 0, 0)),
      new ClockDot(this.scene, new Vector3(6, 0, 0))
    ];

    this.date = new Date();
  }

  private handleResize = () => {
    this.screen = {
      top: 0,
      left: 0,
      width: window.innerWidth,
      height: window.innerHeight
    };

    const {
      width,
      height
    } = this.screen;

    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(width, height);
  }

  private run = () => {
    const currentDate = new Date();

    if (currentDate.getTime() - this.date.getTime() > 980) {
      this.update();
      this.date = currentDate;
    }

    this.renderer.render(this.scene, this.camera);
    this.rafId = requestAnimationFrame(this.run);
  }

  private update() {
    const {
      date
    } = this;

    const hours = date.getHours();
    const minutes = date.getMinutes();
    const seconds = date.getSeconds();

    const numbers = [
      ~~(hours / 10),
      hours % 10,
      ~~(minutes / 10),
      minutes % 10,
      ~~(seconds / 10),
      seconds % 10
    ];

    this.numbers.forEach((num, index) => {
      num.change(numbers[index]);
    });

    this.dots.forEach(dot => {
      dot.reversal();
    });
  }

  public render() {
    return (
      <div
        className={cx('pd-digital-clock-3d')}
        ref={ref => {
          this.container = ref;
        }}
      />
    );
  }
}
