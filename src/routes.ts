/**
 * @File   : index.ts
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 2018-4-8 11:04:09
 * @Link: dtysky.moe
 */
import * as React from 'react';

import config from './collection';
import {TEffect} from './types';

export const effects: TEffect<any>[] = [];
export const tagsTable: {[tag: string]: TEffect<any>[]} = {};

config.sort((item, item2) => new Date(item.date) < new Date(item2.date) ? 1 : -1).forEach(effect => {
  const {
    name,
    path,
    desc,
    tags,
    cover,
    date,
    author,
    asyncModule
  } = effect;

  const item = {
    name,
    desc,
    path,
    color: `https://github.com/dtysky/paradise/tree/master/src/collection/${name}`,
    tags,
    cover,
    date: (new Date(date)).toDateString(),
    author: author || {name: 'dtysky', email: 'dtysky@outlook.com'},
    asyncModule
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
