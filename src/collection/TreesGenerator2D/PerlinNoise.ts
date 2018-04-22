/**
 * @File   : PerlinNoise.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 2018-4-10 16:49:24
 * @Link: dtysky.moe
 */
export default class PerlinNoise {
  public static GRAD3 = [
    [1, 1, 0], [-1, 1, 0], [1, -1, 0], [-1, -1, 0],
    [1, 0, 1], [-1, 0, 1], [1, 0, -1], [-1, 0, -1],
    [0, 1, 1], [0, -1, 1], [0, 1, -1], [0, -1, -1],
  ];

  private p: number[];
  private perm: number[];

  constructor () {
    this.p = [];
    for (let i = 0; i < 256; i++) {
      this.p[i] = ~~(Math.random() * 256);
    }

    this.perm = [];
    for (let i = 0; i < 512; i++) {
      this.perm[i] = this.p[i & 255];
    }
  }

  public static DOT (g: number[], x: number, y: number, z: number) {
    return g[0] * x + g[1] * y + g[2] * z;
  }

  public static MIX (a: number, b: number, t: number) {
    return (1.0 - t) * a + t * b;
  }

  public static FADE (t: number) {
    return t * t * t * (t * (t * 6.0 - 15.0) + 10.0);
  }

  public at (x: number = 0, y: number = 0, z: number = 0) {
    let X = ~~x;
    let Y = ~~y;
    let Z = ~~z;

    x = x - X;
    y = y - Y;
    z = z - Z;

    X = X & 255;
    Y = Y & 255;
    Z = Z & 255;

    const gi000 = this.perm[X + this.perm[Y + this.perm[Z]]] % 12;
    const gi001 = this.perm[X + this.perm[Y + this.perm[Z + 1]]] % 12;
    const gi010 = this.perm[X + this.perm[Y + 1 + this.perm[Z]]] % 12;
    const gi011 = this.perm[X + this.perm[Y + 1 + this.perm[Z + 1]]] % 12;
    const gi100 = this.perm[X + 1 + this.perm[Y + this.perm[Z]]] % 12;
    const gi101 = this.perm[X + 1 + this.perm[Y + this.perm[Z + 1]]] % 12;
    const gi110 = this.perm[X + 1 + this.perm[Y + 1 + this.perm[Z]]] % 12;
    const gi111 = this.perm[X + 1 + this.perm[Y + 1 + this.perm[Z + 1]]] % 12;

    const n000 = PerlinNoise.DOT(PerlinNoise.GRAD3[gi000], x, y, z);
    const n100 = PerlinNoise.DOT(PerlinNoise.GRAD3[gi100], x - 1, y, z);
    const n010 = PerlinNoise.DOT(PerlinNoise.GRAD3[gi010], x, y - 1, z);
    const n110 = PerlinNoise.DOT(PerlinNoise.GRAD3[gi110], x - 1, y - 1, z);
    const n001 = PerlinNoise.DOT(PerlinNoise.GRAD3[gi001], x, y, z - 1);
    const n101 = PerlinNoise.DOT(PerlinNoise.GRAD3[gi101], x - 1, y, z - 1);
    const n011 = PerlinNoise.DOT(PerlinNoise.GRAD3[gi011], x, y - 1, z - 1);
    const n111 = PerlinNoise.DOT(PerlinNoise.GRAD3[gi111], x - 1, y - 1, z - 1);

    const u = PerlinNoise.FADE(x);
    const v = PerlinNoise.FADE(y);
    const w = PerlinNoise.FADE(z);

    const nx00 = PerlinNoise.MIX(n000, n100, u);
    const nx01 = PerlinNoise.MIX(n001, n101, u);
    const nx10 = PerlinNoise.MIX(n010, n110, u);
    const nx11 = PerlinNoise.MIX(n011, n111, u);
    const nxy0 = PerlinNoise.MIX(nx00, nx10, v);
    const nxy1 = PerlinNoise.MIX(nx01, nx11, v);
    const nxyz = PerlinNoise.MIX(nxy0, nxy1, w);

    return nxyz;
  }
}
