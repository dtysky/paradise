/**
 * @File   : ClockDot.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 2018-4-11 16:30:20
 * @Link: dtysky.moe
 */
import {
  Scene, Vector3, Group,
  CubeGeometry, Mesh, MeshBasicMaterial
} from 'three';
import {TweenMax} from 'gsap';

export default class ClockDot {
  private dots: Group;

  constructor(scene: Scene, position: Vector3) {
    const dot1 = this.generateDot();
    const dot2 = this.generateDot();
    dot1.position.set(0, 1.1, 0);
    dot2.position.set(0, 3.3, 0);

    this.dots = new Group();
    this.dots.add(dot1, dot2);
    this.dots.position.copy(position);

    scene.add(this.dots);
  }

  public reversal() {
    if (this.dots.rotation.y >= Math.PI * 2) {
      this.dots.rotation.y = 0;
    }

    TweenMax.to(this.dots.rotation, .4, {y: this.dots.rotation.y + Math.PI});
  }

  private generateDot() {
    const cube1 = new Mesh(new CubeGeometry(1, 1, .5), new MeshBasicMaterial({color: 0x000000}));
    const cube2 = new Mesh(new CubeGeometry(1, 1, .5), new MeshBasicMaterial({color: 0xffffff}));
    cube1.position.set(0, 0, -.25);
    cube2.position.set(0, 0, .25);

    const dot = new Group();
    dot.add(cube1, cube2);

    return dot;
  }
}
