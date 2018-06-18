/**
 * @File   : Component.tsx
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : Sat Jun 16 2018
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
      map: {type: 't', value: textureLoader.load(this.props.map)},
      scaleX: {type: 'f', value: this.props.scaleX},
      scaleY: {type: 'f', value: this.props.scaleY},
      u_time: {type: 'f', value: this.time}
    };

    const material = new THREE.ShaderMaterial({
      uniforms,
      vertexShader: shaders.vertex,
      fragmentShader: shaders.fragment
    });
    material.needsUpdate = true;

    this.mesh = new THREE.Mesh(plane, material);

    this.scene.add(this.mesh);

    window.addEventListener('resize', this.handleResize);

    this.handleResize();
    this.loop();
  }

  public componentWillReceiveProps(nextProps: IControlOptions) {
    const uniforms = (this.mesh.material as THREE.ShaderMaterial).uniforms;
    if (this.props.scaleX !== nextProps.scaleX) {
      uniforms.scaleX.value = nextProps.scaleX;
    }

    if (this.props.scaleY !== nextProps.scaleY) {
      uniforms.scaleY.value = nextProps.scaleY;
    }

    if (this.props.image !== nextProps.image) {
      uniforms.image.value = this.textureLoader.load(nextProps.image);
    }

    if (this.props.map !== nextProps.map) {
      uniforms.map.value = this.textureLoader.load(nextProps.map);
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

  public loop = () => {
    this.time += .0002 * this.props.speed || 0;
    (this.mesh.material as THREE.ShaderMaterial).uniforms.u_time.value = Math.abs(this.time);

    this.renderer.render(this.scene, this.camera);

    requestAnimationFrame(this.loop);
  }

  public render() {
    return (
      <div className={cx('pd-pixel-displacement-2d')}>
        <canvas
          ref={this.container}
        />
      </div>
    );
  }
}
