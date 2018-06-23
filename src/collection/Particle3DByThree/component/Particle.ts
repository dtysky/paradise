/**
 * @File   : Particle.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 2018-6-19 14:17:51
 * @Description:
 */
import * as THREE from 'three';
import * as d3Interpolate from 'd3-interpolate';

import {customInOut, generateRandom} from './utils';

export type TParticleConfig = {
  size: number;
  opacity: number;
  color: THREE.Color;
  born: number;
  life: number;
  edgeTime1: number;
  edgeTime2: number;
};

export default class Particle {
  public mesh: THREE.Mesh;
  public size: number;
  public initialized: boolean;
  private config: TParticleConfig;
  private interpolates: ((t: number) => {scale: number, z: number})[];
  private current: number;

  public static CREATE(config: TParticleConfig): THREE.Mesh {
    const geometry = new THREE.SphereGeometry(config.size, 64, 64);
    const material = new THREE.MeshBasicMaterial({
      opacity: config.opacity,
      color: config.color,
      transparent: true,
      depthTest: false,
      precision: 'lowp'
    });

    const mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(0, 0, -8);
    mesh.scale.set(.05, .05, .05);

    return mesh;
  }

  constructor(group: THREE.Group, config: TParticleConfig) {
    this.config = config;
    this.mesh = Particle.CREATE(config);

    group.add(this.mesh);

    const centerZ = generateRandom(-0.1, 0.1);

    this.interpolates = [
      d3Interpolate.interpolate<{scale: number, z: number}>(
        {scale: 0.05, z: -8},
        {scale: 1, z: centerZ}
      ),
      d3Interpolate.interpolate<{scale: number, z: number}>(
        {scale: 1, z: centerZ},
        {scale: 1, z: 8}
      )
    ];
    this.current = 0;
    this.initialized = false;
  }

  public update(deltaTime: number) {
    const {born, life, size, edgeTime1, edgeTime2} = this.config;

    if (!this.initialized) {
      if (this.current < born) {
        this.current += deltaTime;
        return;
      }

      this.initialized = true;
      this.current = 0;
    }

    if (this.current + deltaTime > life) {
      return;
    }

    this.current += deltaTime;

    const percent = customInOut(this.config.life, life * edgeTime1, life * edgeTime2, this.current);

    if (percent === .5) {
      return;
    }

    const index = percent < .5 ? 0 : 1;
    const realPercent = percent < .5 ? percent * 2 : percent * 2 - 1;
    const {scale, z} = this.interpolates[index](realPercent);

    this.size = scale * size;
    this.mesh.scale.set(scale, scale, scale);
    this.mesh.position.setZ(z);
    (this.mesh.material as THREE.Material).opacity = (1 - Math.abs(z) / 4) * this.config.opacity;
  }

  public reset() {
    this.current = 0;
    this.initialized = false;
    this.mesh.position.set(0, 0, -8);
  }
}
