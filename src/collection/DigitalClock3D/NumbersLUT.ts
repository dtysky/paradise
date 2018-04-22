
/**
 * @File   : NumbersLUT.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 2018-4-12 11:32:34
 * @Link: dtysky.moePlease check file num_helper.py for process of proof.
 */
import {Vector3} from 'three';

const NUMBERS_LUT = [
  // row0
  {
    matrix: [
      0, 0, 1,
      0, 0, 0,
      1, 1, 1
    ],
    degrees: [0, 90, 0, 0, 270, 0, 0, 0, 0, 0]
  },
  // row1
  {
    matrix: [
      0, 0, 0,
      0, 0, 0,
      1, 0, 1
    ],
    degrees: [0, 90, 90, 90, 0, 270, 270, 90, 0, 0]
  },
  // row2
  {
    matrix: [
      0, 0, 1,
      0, 0, 1,
      1, 0, 1
    ],
    degrees: [0, 90, 270, 270, 270, 270, 270, 90, 270, 270]
  },
  // row3
  {
    matrix: [
      0, 0, 0,
      0, 0, 0,
      1, 0, 1
    ],
    degrees: [0, 90, 270, 90, 90, 90, 0, 90, 0, 90]
  },
  // row4
  {
    matrix: [
      0, 0, 0,
      0, 0, 0,
      1, 1, 1
    ],
    degrees: [0, 90, 0, 0, 90, 0, 0, 90, 0, 0]
  }
];

export const NUMBERS_MATRIX = NUMBERS_LUT.map(row => row.matrix);

export const NUMBERS_DEGREES = [[], [], [], [], [], [], [], [], [], []].map((degrees, index) => {
  for (let row = 0; row < NUMBERS_LUT.length; row += 1) {
    degrees.push(NUMBERS_LUT[row].degrees[index] / 180 * Math.PI);
  }

  return degrees;
});

export const NUMBERS_CUBES_POSITIONS = [
  new Vector3(-1.05, 0, -1.05),
  new Vector3(0, 0, -1.05),
  new Vector3(1.05, 0, -1.05),
  new Vector3(-1.05, 0, 0),
  new Vector3(0, 0, 0),
  new Vector3(1.05, 0, 0),
  new Vector3(-1.05, 0, 1.05),
  new Vector3(0, 0, 1.05),
  new Vector3(1.05, 0, 1.05)
];
