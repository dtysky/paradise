/**
 * @File   : Component.tsx
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : Sat Sep 08 2018
 * @Link: dtysky.moe
 */
import * as React from 'react';
import * as cx from 'classnames';
import * as THREE from 'three';
import * as OrbitControlsOrigin from 'three-orbit-controls';
const OrbitControls = OrbitControlsOrigin(THREE);

import {IControlOptions} from '../types';
import glowShader from './glowShader';
import './base.scss';

export default class Component extends React.Component<IControlOptions, {}> {
  private container: React.RefObject<HTMLCanvasElement> = React.createRef();
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private cameraController: any;
  private renderer: THREE.WebGLRenderer;
  private meshes: THREE.Mesh[] = [];

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
    this.scene.background = new THREE.Color(0x101010);

    this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, .01, 1000);
    this.camera.position.set(0, 0, 20);
    this.cameraController = new OrbitControls(this.camera, this.renderer.domElement);
    this.scene.add(this.camera);

    const texture = new THREE.TextureLoader().load(require('../assets/star.jpg'));
    for (let index = 0; index < 20; index += 1) {
      this.generateMeshRandom(index % 4 !== 0 ? null : texture);
    }

    window.addEventListener('resize', this.handleResize);

    this.handleResize();
    this.loop();
  }

  public componentWillReceiveProps(nextProps: IControlOptions) {
    if (this.meshes.length === 0) {
      return;
    }

    this.meshes.forEach(mesh => {
      const uniforms = (mesh.material as THREE.ShaderMaterial).uniforms;

      if (this.props.c !== nextProps.c) {
        uniforms.c.value = nextProps.c;
      }

      if (this.props.p !== nextProps.p) {
        uniforms.p.value = nextProps.p;
      }

      if (this.props.side !== nextProps.side) {
        (mesh.material as THREE.ShaderMaterial).side = nextProps.side;
      }
    });
  }

  private generateMeshRandom(texture: THREE.Texture) {
    const position = new THREE.Vector3((Math.random() - .5) * 30, (Math.random() - .5) * 30, (Math.random() - .5) * 30);
    const color = new THREE.Color(Math.random(), Math.random(), Math.random());

    const geometry = new THREE.SphereGeometry(1, 64, 64);
    const material = new THREE.ShaderMaterial({
        uniforms: {
          view_vector: {type: 'v3f', value: new THREE.Vector3(0, 0, 1)},
          c: {type: 'f', value: this.props.c},
          p: {type: 'f', value: this.props.p},
          glow_color: {type: 'v3f', value: color},
          diffuse: {type: 'v3f', value: texture}
        },
        transparent: true,
        vertexShader: glowShader.vertex,
        fragmentShader: glowShader.fragment,
        side: this.props.side,
        blending: !texture && THREE.AdditiveBlending
      });
    material.needsUpdate = true;
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(position.x, position.y, position.z);
    this.meshes.push(mesh);
    this.scene.add(mesh);
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
    const newView = this.camera.position.clone().sub(this.cameraController.target);
    this.meshes.forEach(mesh => {
      const uniforms = (mesh.material as THREE.ShaderMaterial).uniforms;

      uniforms.view_vector.value = newView;
    });

    this.renderer.render(this.scene, this.camera);

    requestAnimationFrame(this.loop);
  }

  public render() {
    return (
      <div className={cx('pd-rim-light-fresnel')}>
        <canvas
          ref={this.container}
        />
      </div>
    );
  }
}
