#!/usr/bin/env python
# -*- coding: utf-8 -*-
#
# num_helper.py
# @Author : dtysky (dtysky@outlook.com)
# @Date   : 2018-4-12 10:59:15
# @Description: 
ZERO = [
  [1, 1, 1],
  [1, 0, 1],
  [1, 0, 1],
  [1, 0, 1],
  [1, 1, 1]
]

ONE = [
  [0, 0, 1],
  [0, 0, 1],
  [0, 0, 1],
  [0, 0, 1],
  [0, 0, 1]
]

TWO = [
  [1, 1, 1],
  [0, 0, 1],
  [1, 1, 1],
  [1, 0, 0],
  [1, 1, 1]
]

THREE = [
  [1, 1, 1],
  [0, 0, 1],
  [1, 1, 1],
  [0, 0, 1],
  [1, 1, 1]
]

FOUR = [
  [1, 0, 1],
  [1, 0, 1],
  [1, 1, 1],
  [0, 0, 1],
  [0, 0, 1]
]

FIVE = [
  [1, 1, 1],
  [1, 0, 0],
  [1, 1, 1],
  [0, 0, 1],
  [1, 1, 1]
]

SIX = [
  [1, 1, 1],
  [1, 0, 0],
  [1, 1, 1],
  [1, 0, 1],
  [1, 1, 1]
]

SEVEN = [
  [1, 1, 1],
  [0, 0, 1],
  [0, 0, 1],
  [0, 0, 1],
  [0, 0, 1]
]

EIGHT = [
  [1, 1, 1],
  [1, 0, 1],
  [1, 1, 1],
  [1, 0, 1],
  [1, 1, 1]
]

NINE = [
  [1, 1, 1],
  [1, 0, 1],
  [1, 1, 1],
  [0, 0, 1],
  [1, 1, 1]
]

NUMBERS = [ZERO, ONE, TWO, THREE, FOUR, FIVE, SIX, SEVEN, NINE]

def get_all_combos(row_index):
  combos = []
  for number in NUMBERS:
    row = number[row_index]
    try:
      combos.index(row)
    except:
      combos.append(row)
  return combos

for index in range(5):
  print(index, get_all_combos(index))

# 0 [[1, 1, 1], [0, 0, 1], [1, 0, 1]]
# 1 [[1, 0, 1], [0, 0, 1], [1, 0, 0]]
# 2 [[1, 0, 1], [0, 0, 1], [1, 1, 1]]
# 3 [[1, 0, 1], [0, 0, 1], [1, 0, 0]]
# 4 [[1, 1, 1], [0, 0, 1]]
