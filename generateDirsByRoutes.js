#!/usr/bin/env node
/**
 * @File   : generateDirsByRoutes.js
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 2018-4-10 19:02:09
 * @Link: dtysky.moe
 */
const fs = require('fs-extra');
const path = require('path');

function camelcase2Dash(str) {
  return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
}

function getDirectories(dp) {
  return fs.readdirSync(dp).filter(file => {
      return fs.statSync(path.join(dp, file)).isDirectory() && file.substr(0, 1) !== ".";
  });
}

const cp = path.resolve(__dirname, './src/collection');
const routes = getDirectories(cp)
  .map(dir => ({name: dir, route: `effect/${camelcase2Dash(dir)}`}))
  .concat(['tags', 'plats', 'search'].map(val => ({name: val, route: val})));
const html = fs.readFileSync(path.resolve(__dirname, './dist/index.html'), 'utf8');


fs.removeSync(path.resolve(__dirname, './dist/effect'));
fs.mkdirSync(path.resolve(__dirname, './dist/effect'));

routes.forEach(route => {
  const sp = path.resolve(cp, route.name);
  const dp = path.resolve(__dirname, `./dist/${route.route}`);
  if (!fs.existsSync(dp)) {
    fs.removeSync(dp);
    fs.mkdirSync(dp);
  }
  fs.writeFileSync(path.resolve(dp, './index.html'), html);
  if (fs.existsSync(path.resolve(sp, './assets'))) {
    fs.copySync(path.resolve(sp, './assets'), path.resolve(dp, './assets'));
  }
});
