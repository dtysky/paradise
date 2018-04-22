/**
 * @File   : index.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 2018-4-4 17:01:25
 * @Link: dtysky.moe
 */
import Component from './Component';
import Controller from './Controller';
const info = require('./readme.md');

export default {
  name: 'RainbowStarWave',
  desc: 'Rainbow star wave by pure css.',
  tags: ['CSS'],
  cover: require('./cover.jpg'),
  info,
  date: '2018/04/09',
  Component,
  Controller
};
