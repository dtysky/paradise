/**
 * @File   : Component.tsx
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : Sun Jul 01 2018
 * @Link: dtysky.moe
 */
import * as React from 'react';
import * as cx from 'classnames';
import * as THREE from 'three';

import {IControlOptions} from '../types';
import shaders from './shaders';
import './base.scss';

export default class Component extends React.Component<IControlOptions, {}> {
  private container: React.RefObject<HTMLCanvasElement> = React.createRef();
  private textureLoader: THREE.TextureLoader;
  private scene: THREE.Scene;
  private camera: THREE.Camera;
  private renderer: THREE.Renderer;
  private mesh: THREE.Mesh;
  private time: number = 0;

  public componentDidMount() {
    const dom = this.container.current;

    dom.style.width = `${window.innerWidth}px`;
    dom.style.height = `${window.innerHeight}px`;

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.container.current,
      antialias: true
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);

    this.scene = new THREE.Scene();

    this.camera = new THREE.OrthographicCamera(-8, 8, 4.5, -4.5, .1, 100);
    this.camera.position.set(0, 0, 1);
    this.camera.lookAt(new THREE.Vector3(0, 0, 0));
    this.scene.add(this.camera);

    const light = new THREE.AmbientLight(0xffffff);
    this.scene.add(light);

    const textureLoader = this.textureLoader = new THREE.TextureLoader();

    const plane = new THREE.PlaneGeometry(16, 9);
    const uniforms = {
      image: {type: 't', value: textureLoader.load(this.props.image)},
      aspect: {type: 'f', value: 16 / 9},
      radius: {type: 'f', value: this.props.radius},
      amp: {type: 'f', value: this.props.amp},
      band: {type: 'f', value: this.props.band},
      waves: {type: 'f', value: this.props.waves},
      speed: {type: 'f', value: this.props.speed},
      u_time: {type: 'f', value: this.time},
      progress: {type: 'fv', value: [
        -1, -1, -1, -1
      ]},
      centres: {type: 'v2v', value: [
        new THREE.Vector2(0.0, 0.0),
        new THREE.Vector2(0.0, 0.0),
        new THREE.Vector2(0.0, 0.0),
        new THREE.Vector2(0.0, 0.0)
      ]}
    };

    const material = new THREE.ShaderMaterial({
      uniforms,
      vertexShader: shaders.vertex,
      fragmentShader: shaders.fragment
    });
    material.needsUpdate = true;

    this.mesh = new THREE.Mesh(plane, material);

    this.scene.add(this.mesh);

    this.container.current.addEventListener('click', this.handleClick);
    window.addEventListener('resize', this.handleResize);

    this.handleResize();
    this.loop();
  }

  public componentWillReceiveProps(nextProps: IControlOptions) {
    const uniforms = (this.mesh.material as THREE.ShaderMaterial).uniforms;
    if (this.props.radius !== nextProps.radius) {
      uniforms.radius.value = nextProps.radius;
    }

    if (this.props.image !== nextProps.image) {
      uniforms.image.value = this.textureLoader.load(nextProps.image);
    }

    if (this.props.amp !== nextProps.amp) {
      uniforms.amp.value = nextProps.amp;
    }

    if (this.props.waves !== nextProps.waves) {
      uniforms.waves.value = nextProps.waves;
    }

    if (this.props.band !== nextProps.band) {
      uniforms.band.value = nextProps.band;
    }

    if (this.props.speed !== nextProps.speed) {
      uniforms.speed.value = nextProps.speed;
    }
  }

  private handleResize = () => {
    const width = window.innerWidth;
    const height = window.innerHeight;

    let rWidth, rHeight, rTop, rLeft;
    if (width / height > 16 / 9) {
      rWidth = width;
      rHeight = width * 9 / 16;
      rTop = (height - rHeight) / 2;
      rLeft = 0;
    } else {
      rHeight = height;
      rWidth = height * 16 / 9;
      rLeft = (width - rWidth) / 2;
      rTop = 0;
    }

    this.container.current.style.width = `${rWidth}px`;
    this.container.current.style.height = `${rHeight}px`;
    this.container.current.style.top = `${rTop}px`;
    this.container.current.style.left = `${rLeft}px`;
    this.renderer.setSize(rWidth, rHeight);
  }

  private handleClick = (event: MouseEvent) => {
    const uniforms = (this.mesh.material as THREE.ShaderMaterial).uniforms;
    const {clientX, clientY} = event;

    for (let index = 0; index < 4; index += 1) {
      if (uniforms.progress.value[index] === -1) {
        uniforms.progress.value[index] = 0;
        uniforms.centres.value[index] = new THREE.Vector2(
          clientX / this.container.current.clientWidth,
          1 - clientY / this.container.current.clientHeight
        );
        break;
      }
    }
  }

  public loop = () => {
    const {uniforms} =  (this.mesh.material as THREE.ShaderMaterial);
    const diff = performance.now() - this.time;
    this.time = performance.now();
    uniforms.u_time.value = Math.abs(this.time);

    for (let index = 0; index < 4; index += 1) {
      const progress = uniforms.progress.value[index];
      if (progress >= 1) {
        uniforms.progress.value[index] = -1;
      } else if (progress >= 0) {
        uniforms.progress.value[index] += diff / (this.props.life * 1000);
      }
    }

    this.renderer.render(this.scene, this.camera);

    requestAnimationFrame(this.loop);
  }

  public render() {
    return (
      <div className={cx('pd-shunguang-dty-shader-water-ripple')}>
        <canvas
          ref={this.container}
        />
        <p>点击来生成水波，最多四个</p>
      </div>
    );
  }
}
