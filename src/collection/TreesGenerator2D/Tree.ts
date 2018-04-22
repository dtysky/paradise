/**
 * @File   : Tree.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 2018-4-10 14:41:11
 * @Link: dtysky.moe
 */
import PerlinNoise from './PerlinNoise';

const noise = new PerlinNoise();

function radians(degrees) {
  return degrees * Math.PI / 180;
};

class Point {
  public drawn: boolean;
  public age: number;
  public x: number;
  public y: number;
  public color: [number, number, number];
  public radius: number;
  public opacity: number;
  public degrees: number;
  public spawned: boolean;
  public variance: number;

  constructor(
    x: number,
    y: number,
    color: [number, number, number],
    age: number,
    degrees: number,
    variance: number
  ) {
     this.x = x;
     this.y = y;
     this.color = color;
     this.age = age;
     this.degrees = degrees;
     this.variance = variance;
     this.opacity = (Tree.MAX_AGE - age) / Tree.MAX_AGE;
     this.radius = Tree.DIAMETER;
     this.drawn = false;
  }
}

export default class Tree {
  public static MAX_AGE = 80;
  public static LEAF_DISTANCE = 6;
  public static DIAMETER = 10;
  public static LEAFE_SIZE = 3;
  public static TREE_VARIANCE = 2;
  public static BRANCH_VARIANCE = 30;
  public static DRAW_DISTANCE = 3;
  public static id: number = -1;

  public drawn: boolean;

  private uuid: number;
  private x: number;
  private y: number;
  private color: [number, number, number];
  private points: Point[];
  private leaves: Point[];
  private generated: boolean;

  constructor(
    x: number,
    y: number,
    color: [number, number, number]
  ) {
    Tree.id += 1;
    this.uuid = Tree.id;
    this.x = x;
    this.y = y;
    this.color = color;

    this.points = [new Point(x, y, color, 0, -90, Tree.TREE_VARIANCE)];
    this.leaves = [];
    this.drawn = false;
    this.generated = false;
  }

  public update() {
    if (this.generated) {
      return;
    }

    let generated = true;

    this.points.forEach(point => {
      if (point.spawned || point.age >= Tree.MAX_AGE) {
        return;
      }

      generated = false;
      point.age += 1;

      const branch = (variance: number) => {
        const reduce = 0.01;
        const n = (noise.at((point.x + point.age) * reduce, (point.y + point.age) * reduce) - 0.5) * 4 * Math.PI;
        const mag = noise.at((point.y + point.age) * reduce, (point.x + point.age) * reduce);
        const dirX = Math.cos(n) * mag;
        const dirY = Math.sin(n) * mag;

        const diff = variance * point.opacity;
        const degrees = point.degrees + (-diff + Math.random() * diff * 2);

        const randX = Math.cos(radians(degrees)) * Tree.DRAW_DISTANCE;
        const randY = Math.sin(radians(degrees)) * Tree.DRAW_DISTANCE;

        const x = point.x + dirX + randX;
        const y = point.y + dirY + randY;

        this.points.push(new Point(
          x,
          y,
          point.color,
          point.age,
          degrees,
          variance
        ));
      };

      if (
        point.age > Tree.MAX_AGE * .2
        && point.age < Tree.MAX_AGE * .8
        && Math.random() < .07 * (1 - point.opacity * .4)
      ) {
        branch(point.variance + Tree.BRANCH_VARIANCE);
      }

      if (Math.random() < 0.2 && point.age > Tree.MAX_AGE * 0.8) {
        this.addLeaf(point);
        this.addLeaf(point);
        this.addLeaf(point);
      }

      branch(point.variance);
      point.spawned = true;
    });

    this.generated = generated;
  }

  private addLeaf(point: Point) {
    const {
      LEAF_DISTANCE,
      LEAFE_SIZE
    } = Tree;

    const leaf = new Point(
      point.x + (-LEAF_DISTANCE + Math.random() * (LEAF_DISTANCE * 2)),
      point.y + (-LEAF_DISTANCE + Math.random() * (LEAF_DISTANCE * 2)),
      [point.color[0] + 25, point.color[1], point.color[2]],
      0, 0, 0
    );

    leaf.opacity = 0;
    leaf.spawned = true;
    leaf.radius = LEAFE_SIZE + Math.random() * (LEAFE_SIZE * 2);

    this.leaves.push(leaf);
  }

  public draw(ctx: CanvasRenderingContext2D) {
    let drawn = true;

    // draw trunk and branches
    this.points.forEach(point => {
      if (point.drawn) {
        return;
      }

      drawn = false;
      this.drawPoint(ctx, point);
      point.drawn = true;
    });

    // draw leaves
    if (drawn) {
      this.leaves.forEach(point => {
        if (point.drawn) {
          return;
        }

        drawn = false;
        this.drawPoint(ctx, point, point.radius, .15);
        point.drawn = true;
      });
    }

    this.drawn = drawn;
  }

  private drawPoint(ctx: CanvasRenderingContext2D, point: Point, radius: number = 0, opacity: number = 1) {
    ctx.beginPath();
    ctx.arc(point.x, point.y, radius || point.radius * point.opacity, 0, Math.PI * 2);
    ctx.fillStyle = `hsla(${point.color[0]}, ${point.color[1]}%, ${point.color[2] + 20 * point.opacity}%, ${opacity})`;
    ctx.fill();
  }
}
