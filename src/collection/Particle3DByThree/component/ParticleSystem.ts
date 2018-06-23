/**
 * @File   : ParticleSystem.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 2018-6-19 14:31:40
 * @Description:
 */
import * as THREE from 'three';

import {generateRandom} from './utils';
import Particle from './Particle';

export type TParticleSystemConfig = {
  count: number;
  duration: number;
  speed: number;
  edgeTime1: number;
  edgeTime2: number;
  spacing: number;
};

export default class ParticleSystem {
  private config: TParticleSystemConfig;
  private group: THREE.Group;
  private particles: Particle[];
  private scene: THREE.Scene;
  private playing: boolean = false;
  private current: number;

  constructor(scene: THREE.Scene) {
    this.scene = scene;
    this.group = new THREE.Group();

    scene.add(this.group);
  }

  public init(config: TParticleSystemConfig) {
    this.config = config;
    this.group.children = [];
    this.particles = [];
    this.playing = false;
    this.current = -1;

    this.initParticles();
  }

  public initParticles() {
    const {duration, count, edgeTime1, edgeTime2} = this.config;

    const bornBase = duration / count / 10;
    const layers = count / 10;
    const life = duration - bornBase * count / layers;

    for (let i = 0; i < this.config.count; i += 1) {
      const born = i / layers * bornBase;

      this.particles.push(new Particle(this.group, {
        size: generateRandom(.04, .1),
        color: new THREE.Color(0xffffff),
        opacity: generateRandom(.3, .8),
        born,
        life: life,
        edgeTime1,
        edgeTime2
      }));
    }
  }

  public update(deltaTime: number) {
    if (!this.playing) {
      return;
    }

    const {duration, speed, count, spacing} = this.config;

    let dTime = 0;
    if (this.current + deltaTime > duration || this.current === -1) {
      this.current = 0;
      this.particles.forEach(particle => particle.reset());
    } else {
      dTime = deltaTime * speed;
      for (let i = 0; i < count; i += 1) {
        this.particles[i].update(dTime);
      }
      this.current += dTime;
    }

    for (let i = 0; i < count; i += 1) {
      const p1 = this.particles[i];
      const p1Pos = p1.mesh.position;

      if (!p1.initialized) {
        continue;
      }

      for (let j = 0; j < count; j += 1) {
        const p2 = this.particles[j];

        if (p1 === p2 || !p2.initialized) {
          continue;
        }

        const p2Pos = p2.mesh.position;
        const dx = p1Pos.x - p2Pos.x;
        const dy = p1Pos.y - p2Pos.y;
        const dist = dx * dx + dy * dy;
        const radii = (p1.size + p2.size) * (p1.size + p2.size) + spacing;

        if (dist < radii) {
          const angle = Math.atan2(dy, dx) + generateRandom(-0.05, 0.05);
          const diff = radii - dist;
          const x = Math.cos(angle) * diff * 0.05;
          const y = Math.sin(angle) * diff * 0.05;
          p1Pos.x += x * dTime;
          p1Pos.y += y * dTime;
          p2Pos.x -= x * dTime;
          p2Pos.y -= y * dTime;
        }
      }
    }

    this.group.rotateZ(.001);
  }

  public play() {
    this.current = -1;
    this.playing = true;
  }

  public reset() {
    this.particles.forEach(particle => particle.reset());
  }

  public destroy() {
    this.scene.remove(this.group);
  }
}
