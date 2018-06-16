/**
 * @File   : index.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 2018-4-10 11:58:26
 * @Link: dtysky.moe
 */
import {TEffect} from '../../types';
import {IControlOptions} from './types';
import Component from './Component';
import Controller from './Controller';

const info = require('./readme.md');

const effect: TEffect<IControlOptions> = {
  name: 'TreesGenerator2D',
  path: 'trees-generator-2d',
  desc: 'Plat trees with canvas.',
  tags: ['Canvas', 'Tree'],
  cover: require('./cover.jpg'),
  info,
  date: '2018/04/10',
  Component,
  Controller
};

export default effect;
