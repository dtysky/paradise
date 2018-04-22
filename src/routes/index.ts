/**
 * @File   : index.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 2018-4-8 11:04:09
 * @Link: dtysky.moe
 */
import * as React from 'react';

import config from './config';
import {TRouteItem} from './types';

function camelcase2Dash(str: string) {
  return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
}

export const effects: TRouteItem[] = [];
export const tagsTable: {[tag: string]: TRouteItem[]} = {};

config.sort((item, item2) => new Date(item.date) < new Date(item2.date) ? 1 : -1).forEach(({
  name,
  desc,
  info,
  tags,
  cover,
  date,
  author,
  Component,
  Controller
}) => {
  const path = camelcase2Dash(name);

  const item: TRouteItem = {
    name,
    desc,
    path,
    tags,
    cover,
    info,
    date: new Date(date),
    author: author || {name: 'dtysky', email: 'dtysky@outlook.com'},
    Component,
    Controller
  };

  // shared reference !
  effects.push(item);

  tags.forEach(tag => {
    if (!tagsTable[tag]) {
      tagsTable[tag] = [];
    }

    tagsTable[tag].push(item);
  });
});

export const tags = Object.keys(tagsTable).sort();
