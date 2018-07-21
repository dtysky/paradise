/**
 * @File   : Component.tsx
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : Sat Jul 21 2018
 * @Link: dtysky.moe
 */
import * as React from 'react';
import * as cx from 'classnames';
import * as THREE from 'three';
import * as OrbitControlsOrigin from 'three-orbit-controls';
const OrbitControls = OrbitControlsOrigin(THREE);

import {IControlOptions} from '../types';
import shaders from './shaders';
import './base.scss';
import { ShaderMaterial } from 'three';

export default class Component extends React.Component<IControlOptions, {}> {
  private container: React.RefObject<HTMLCanvasElement> = React.createRef();
  private scene: THREE.Scene;
  private camera: THREE.Camera;
  private renderer: THREE.WebGLRenderer;
  private mesh: THREE.Mesh;
  private waiting: boolean = false;

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

    // this.camera = new THREE.OrthographicCamera(-12, 12, 6.75, -6.75, .1, 100);
    this.camera = new THREE.PerspectiveCamera(80, window.innerWidth / window.innerHeight, .1, 1000);
    this.camera.position.set(0, 0, 10);
    this.camera.lookAt(new THREE.Vector3(0, 0, 0));
    this.scene.add(this.camera);
    new OrbitControls(this.camera, this.container.current);

    this.initMesh();

    window.addEventListener('resize', this.handleResize);

    // this.handleResize();
    this.loop();
  }

  public componentWillReceiveProps(nextProps: IControlOptions) {

  }

  public componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }

  private initMesh() {
    const textureLoader = new THREE.TextureLoader();
    const left = -6;
    const right = 6;
    const top = -4;
    const bottom = 4;
    const width = right - left;
    const height = bottom - top;

    const uniforms = {
      image1: {type: 't', value: textureLoader.load(require('../assets/image1.jpg'))},
      image2: {type: 't', value: textureLoader.load(require('../assets/image2.jpg'))},
      left: {type: 'f', value: left},
      top: {type: 'f', value: top},
      width: {type: 'f', value: width},
      height: {type: 'f', value: height},
      bout: {type: 'i', value: 0},
      progress: {type: 'f', value: 0}
    };
    const material = new THREE.RawShaderMaterial({
      uniforms,
      vertexShader: shaders.vertex,
      fragmentShader: shaders.fragment,
      side: THREE.DoubleSide,
      vertexColors: THREE.VertexColors
    });
    material.needsUpdate = true;

    const geometry = new THREE.BufferGeometry();
    const positions = [];
    const uvs = [];
    const centres = [];

    const stepX = .1;
    const stepY = .05;
    const hStepX = stepX;
    const hStepY = stepY;

    for (let x = left; x < right; x += stepX) {
      for (let y = top; y < bottom; y += stepY) {
        const xL = x;
        const xR = x + hStepX;
        const yT = y;
        const yB = y + hStepY;

        positions.push(xL, yT, 0);
        uvs.push((xL + right) / width, (yT + bottom) / height);

        positions.push(xL, yB, 0);
        uvs.push((xL + right) / width, (yB + bottom) / height);

        positions.push(xR, yB, 0);
        uvs.push((xR + right) / width, (yB + bottom) / height);

        for (let i = 0; i < 3; i += 1) {
          centres.push(xL + (xR - xL) / 4, (yT + yB) / 2, 0);
        }

        positions.push(xL, yT, 0);
        uvs.push((xL + right) / width, (yT + bottom) / height);

        positions.push(xR, yT, 0);
        uvs.push((xR + right) / width, (yT + bottom) / height);

        positions.push(xR, yB, 0);
        uvs.push((xR + right) / width, (yB + bottom) / height);

        for (let i = 0; i < 3; i += 1) {
          centres.push(xR - (xR - xL) / 4, (yT + yB) / 2, 0);
        }
      }
    }

    function disposeArray() { this.array = null; }

    geometry.addAttribute('position', new THREE.Float32BufferAttribute(positions, 3).onUpload(disposeArray));
    geometry.addAttribute('centre', new THREE.Float32BufferAttribute(centres, 3).onUpload(disposeArray));
    geometry.addAttribute('uv', new THREE.Float32BufferAttribute(uvs, 2).onUpload(disposeArray));

    geometry.computeBoundingSphere();

    this.mesh = new THREE.Mesh(geometry, material);
    // this.mesh.rotateX(-Math.PI / 9);

    this.scene.add(this.mesh);
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
    if (!this.waiting) {
      const progress = (this.mesh.material as ShaderMaterial).uniforms.progress;
      const bout = (this.mesh.material as ShaderMaterial).uniforms.bout;
      if (progress.value < 1) {
        progress.value += .005;
      } else {
        this.waiting = true;

        setTimeout(
          () => {
            progress.value = 0;
            bout.value = bout.value ? 0 : 1;
            this.waiting = false;
          },
          1000
        );
      }
    }

    this.renderer.render(this.scene, this.camera);

    requestAnimationFrame(this.loop);
  }

  public render() {
    return (
      <div className={cx('pd-shunguang-dty-2d-image-fragment-transition')}>
        <canvas
          ref={this.container}
        />
      </div>
    );
  }
}
