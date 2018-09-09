/**
 * @File   : Component.tsx
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : Sun Sep 09 2018
 * @Link: dtysky.moe
 */
import * as React from 'react';
import * as cx from 'classnames';
import * as THREE from 'three';
import * as OrbitControlsOrigin from 'three-orbit-controls';
const OrbitControls = OrbitControlsOrigin(THREE);

import {IControlOptions} from '../types';
import shaderThreshold from './shaderThreshold';
import shaderLocalFilter from './shaderLocalFilter';
import shaderBloom from './shaderBloom';
import './base.scss';

export default class Component extends React.Component<IControlOptions, {}> {
  private container: React.RefObject<HTMLCanvasElement> = React.createRef();
  private scene: THREE.Scene;
  private camera: THREE.PerspectiveCamera;
  private cameraController: any;
  private meshes: THREE.Mesh[] = [];
  private renderer: THREE.WebGLRenderer;
  private rendererTarget0: THREE.WebGLRenderTarget;
  private rendererTarget1: THREE.WebGLRenderTarget;
  private rendererTarget2: THREE.WebGLRenderTarget;
  private thresholdMaterial: THREE.ShaderMaterial;
  private localFilterMaterial: THREE.ShaderMaterial;
  private bloomMaterial: THREE.ShaderMaterial;
  private finalCamera = new THREE.OrthographicCamera(- 1, 1, 1, - 1, 0, 1);
  private finalScene = new THREE.Scene();
  private quad: THREE.Mesh;

  public componentDidMount() {
    const dom = this.container.current;

    dom.style.width = `${window.innerWidth}px`;
    dom.style.height = `${window.innerHeight}px`;

    this.renderer = new THREE.WebGLRenderer({
      canvas: this.container.current,
      antialias: true
    });

    this.scene = new THREE.Scene();

    this.camera = new THREE.PerspectiveCamera(80, window.innerWidth / window.innerHeight, .01, 100);
    this.cameraController = new OrbitControls(this.camera, this.renderer.domElement);
    this.camera.position.set(0, 0, 3);
    this.camera.lookAt(new THREE.Vector3(0, 0, 0));
    this.scene.add(this.camera);

    for (let index = 0; index < 20; index += 1) {
      this.generateMeshRandom();
    }

    this.rendererTarget0 = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight);
    this.rendererTarget1 = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight);
    this.rendererTarget2 = new THREE.WebGLRenderTarget(window.innerWidth, window.innerHeight);
    this.thresholdMaterial = new THREE.ShaderMaterial({
      uniforms: {
        threshold: {type: 'f', value: this.props.stepSize},
        tDiffuse: {type: 't', value: null}
      },
      vertexShader: shaderThreshold.vertex,
      fragmentShader: shaderThreshold.fragment
    });
    this.localFilterMaterial = new THREE.ShaderMaterial({
      uniforms: {
        stepSize: {type: 'f', value: this.props.stepSize},
        tThreshold: {type: 't', value: null},
        vDirection: {type: 'b', value: false}
      },
      vertexShader: shaderLocalFilter.vertex,
      fragmentShader: shaderLocalFilter.fragment
    });
    this.bloomMaterial = new THREE.ShaderMaterial({
      uniforms: {
        toneExp: {type: 'f', value: this.props.toneExp},
        tBlur: {type: 't', value: null},
        tDiffuse: {type: 't', value: null}
      },
      vertexShader: shaderBloom.vertex,
      fragmentShader: shaderBloom.fragment
    });
    this.quad = new THREE.Mesh(new THREE.PlaneBufferGeometry(2, 2), null);
    this.quad.frustumCulled = false;
    this.finalScene.add(this.quad);

    window.addEventListener('resize', this.handleResize);

    this.handleResize();
    this.loop(0);
  }

  public componentWillReceiveProps(nextProps: IControlOptions) {
    if (nextProps.threshold !== this.props.threshold) {
      this.thresholdMaterial.uniforms.threshold.value = nextProps.threshold;
    }

    if (nextProps.stepSize !== this.props.stepSize) {
      this.localFilterMaterial.uniforms.stepSize.value = nextProps.stepSize;
    }

    if (nextProps.toneExp !== this.props.toneExp) {
      this.bloomMaterial.uniforms.toneExp.value = nextProps.toneExp;
    }
  }

  private generateMeshRandom() {
    const position = new THREE.Vector3((Math.random() - .5) * 30, (Math.random() - .5) * 30, (Math.random() - .5) * 30);
    const rotation = new THREE.Vector3((Math.random() - .5) * 360, (Math.random() - .5) * 360, (Math.random() - .5) * 360);
    const color = new THREE.Color(Math.random(), Math.random(), Math.random());
    const type = ~~(Math.random() * 4)

    let geometry;

    if (type === 0) {
      geometry = new THREE.SphereGeometry(1, 32, 32);
    } else if (type === 1) {
      geometry = new THREE.BoxGeometry(1, 1, 1);
    } else if (type === 2) {
      geometry = new THREE.CylinderGeometry(.5, 1, 1.5, 32);
    } else if (type === 3) {
      geometry = new THREE.ConeGeometry(1, 1, 32);
    }

    const material = new THREE.MeshBasicMaterial({color});
    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(position.x, position.y, position.z);
    mesh.rotation.set(rotation.x, rotation.y, rotation.z);
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
    this.rendererTarget0.setSize(width, height);
    this.rendererTarget1.setSize(width / 2, height / 2);
    this.rendererTarget2.setSize(width / 2, height / 2);
  }

  public loop = (delta: number) => {
    this.renderer.render(this.scene, this.camera, this.rendererTarget0, true);

    this.quad.material = this.thresholdMaterial;
    this.thresholdMaterial.uniforms.tDiffuse.value = this.rendererTarget0.texture;
    this.renderer.render(this.finalScene, this.finalCamera, this.rendererTarget1, true);

    this.quad.material = this.localFilterMaterial;
    this.localFilterMaterial.uniforms.vDirection.value = false;
    this.localFilterMaterial.uniforms.tThreshold.value = this.rendererTarget1.texture;
    this.renderer.render(this.finalScene, this.finalCamera, this.rendererTarget2, true);

    this.localFilterMaterial.uniforms.vDirection.value = true;
    this.localFilterMaterial.uniforms.tThreshold.value = this.rendererTarget2.texture;
    this.renderer.render(this.finalScene, this.finalCamera, this.rendererTarget1, true);

    this.quad.material = this.bloomMaterial;
    this.bloomMaterial.uniforms.tDiffuse.value = this.rendererTarget0.texture;
    this.bloomMaterial.uniforms.tBlur.value = this.rendererTarget1.texture;
    this.renderer.render(this.finalScene, this.finalCamera);

    requestAnimationFrame(this.loop);
  }

  public render() {
    return (
      <div className={cx('pd-global-bloom')}>
        <canvas
          ref={this.container}
        />
      </div>
    );
  }
}
