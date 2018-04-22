/**
 * @File   : index.ts
 * @Author : {AUTHOR}
 * @Date   : {DATE}
 * @Link: dtysky.moe
 */
import Component from './Component';
import Controller from './Controller';
const info = require('./readme.md');

export default {
  name: '{NAME}',
  tags: [{TAGS}],
  cover: require('./cover.jpg'),
  info,
  author: {
    name: {AUTHOR_NAME},
    email: {AUTHOR_EMAIL}
  },
  date: '{DATE}',
  Component,
  Controller
};
