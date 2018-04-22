/**
 * @File   : ClockNumber.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 2018-4-11 16:30:11
 * @Link: dtysky.moe
 */
import {
  Scene, Vector3, Group,
  CubeGeometry, Mesh, MeshBasicMaterial, MeshPhongMaterial
} from 'three';
import {TweenMax} from 'gsap';

import {NUMBERS_MATRIX, NUMBERS_DEGREES, NUMBERS_CUBES_POSITIONS} from './NumbersLUT';

export default class ClockNumber {
  private num: Group;
  private rows: Group[];
  
  constructor(scene: Scene, position: Vector3) {
    this.num = new Group();
    this.rows = [];

    for (let index = 0; index < 5; index += 1) {
      const row = this.generateRow(index);

      this.rows.push(row);
      this.num.add(row);
    }

    this.num.position.copy(position);
    scene.add(this.num);
  }

  public change(num: number) {
    const DEGREES = NUMBERS_DEGREES[num];
    const PI2 = Math.PI * 2;

    for (let index = 0; index < 5; index += 1) {
      const row = this.rows[index];
      if (row.rotation.y >= PI2) {
        row.rotation.y -= PI2;
      }

      let degree = DEGREES[index];
      const preDegree = row.rotation.y;
      if (degree < preDegree) {
        degree += PI2;
      }

      TweenMax.to(row.rotation, .4, {y: degree});
    }
  }

  private generateRow(index: number) {
    const row = new Group();
    for (let i = 0; i < 9; i += 1) {
      row.add(this.generateCube(NUMBERS_MATRIX[index], i));
    }

    row.position.set(0, 4.2 - index * 1.05, 0);

    return row;
  }

  private generateCube(matrix: number[], index: number) {
    const cube = new Mesh(
      new CubeGeometry(1, 1, 1),
      new MeshPhongMaterial({color: matrix[index] === 0 ? 0xffffff : 0x000000})
    );

    cube.position.copy(NUMBERS_CUBES_POSITIONS[index]);

    return cube;
  }
}
