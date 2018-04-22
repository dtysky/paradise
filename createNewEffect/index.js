#!/usr/bin/env node
/**
 * @File   : createNewEffect.js
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 2018-4-13 16:05:29
 * @Link: dtysky.moe
 */
const fs = require('fs');
const path = require('path');
const readline = require('readline');
const PImage = require('pureimage');

function camelcase2Dash(str) {
  return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
}

function getDirectories(dp) {
  return fs.readdirSync(dp).filter(file =>
      fs.statSync(path.join(dp, file)).isDirectory() && file.substr(0, 1) !== "."
  );
}

function getFiles(dp) {
  return fs.readdirSync(dp).filter(file => fs.statSync(path.join(dp, file)).isFile());
}

const collectionPath = path.resolve(__dirname, '../src/collection');
const collection = getDirectories(collectionPath)

const templatesPath = path.resolve(__dirname, './templates');
const templates = getFiles(templatesPath).map(fp => (
  {
    name: fp,
    template: fs.readFileSync(path.resolve(templatesPath, fp), 'utf8')
  }
));

function createCover(name) {
  return new Promise((resolve, reject) => {
    const fnt = PImage.registerFont(path.resolve(__dirname, 'prototype.ttf'), 'prototype');

    fnt.load(() => {
      const image = PImage.make(400, 300);
      const ctx = image.getContext('2d');
      ctx.fillStyle = '#0bf';
      ctx.fillRect(0, 0, 400, 300);
      ctx.fillStyle = '#ffffff';
      ctx.font = '38pt prototype';
      const textWidth = name.length * 32;
      ctx.fillText(name, (400 - textWidth) / 2, 160);

      resolve(image);
    });
  });
}

function create(name, tags, author, email) {
  const dirPath = path.resolve(collectionPath, name);
  const cls = camelcase2Dash(name);
  const date = (new Date()).toDateString();
  author = (author || email) ? `${author} (${email})` : '';
  tags = tags.split(',').map(tag => `'${tag}'`).join(', ')
  
  fs.mkdirSync(dirPath);

  templates.map(template => {
    fs.writeFileSync(
      path.resolve(dirPath, template.name),
      template.template
        .replace(/\{NAME\}/g, name)
        .replace(/\{DATE\}/g, date)
        .replace(/\{CLASS\}/g, cls)
        .replace(/\{AUTHOR\}/g, author)
        .replace(/\{TAGS\}/g, tags)
        .replace(/\{AUTHOR_NAME\}/g, author)
        .replace(/\{AUTHOR_EMAIL\}/g, email)
    );
  });

  createCover(name).then(image => {
    PImage.encodeJPEGToStream(
      image,
      fs.createWriteStream(path.resolve(dirPath, 'cover.jpg'))
    );
  });
}

function error(msg) {
  console.error('\x1b[31m%s', `Error: ${msg}`);
  process.exit(0);
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.write('Set information for your effect:\n');

rl.question('Name of your effects: ', name => {
  if (!name) {
    error('Name can not be empty !');
  }

  if (collection.includes(name)) {
    error('Effect is existed, check folder "./src/collection" !');
  }

  if (!/^[A-Z].*/.test(name)) {
    error('Name must be camel case !');
  }

  rl.question('Tags, a comma-separated list: ', tags => {
    if (!/^[A-Za-z0-9]+[,A-Za-z0-9]*$/.test(tags)) {
      error('Tags must be like "aaa,bbb,ccc" !');
    }

    rl.question(`Author: `, author => {

      rl.question(`Email: `, email => {
        create(name, tags, author, email);

        rl.close();
      });
    });
  });
});
