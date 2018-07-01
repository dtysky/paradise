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
const stringHash = require('string-hash');
const colorSpace = require('color-space');
const through = require('through2');
const copy = require('recursive-copy');

function showError(msg) {
  console.error('\x1b[31m%s', `Error: ${msg}`);
  process.exit(0);
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
const collection = getDirectories(collectionPath);
const templatesPath = path.resolve(__dirname, './templates');

function stringAsHueToHSLToRGB(str, s, l, range = [0, 360]) {
  const h = Math.round(stringHash(str) % (range[1] - range[0])) + range[0];
  const color = colorSpace.hsl.rgb([h, s, l]).map(channel => Math.round(channel));

  return `rgb(${color.join(', ')})`;
}

function createCover(name) {
  const image = PImage.make(400, 300);
  const ctx = image.getContext('2d');
  ctx.fillStyle = stringAsHueToHSLToRGB(name, 50, 60);
  ctx.fillRect(0, 0, 400, 300);

  return image;
}

async function create(name, route, desc, tags, author, email) {
  const dirPath = path.resolve(collectionPath, name);
  const cls = route;
  const date = (new Date()).toDateString();
  author = (author && email) ? `${author} (${email})` : '';
  tags = tags.split(',').map(tag => `'${tag}'`).join(', ')
  
  fs.mkdirSync(dirPath);

  const renderTemplate = (template) => template
    .replace(/\{NAME\}/g, name)
    .replace(/\{ROUTE\}/g, route)
    .replace(/\{DESC\}/g, desc)
    .replace(/\{DATE\}/g, date)
    .replace(/\{CLASS\}/g, cls)
    .replace(/\{AUTHOR\}/g, author)
    .replace(/\{TAGS\}/g, tags)
    .replace(/\{AUTHOR_NAME\}/g, author)
    .replace(/\{AUTHOR_EMAIL\}/g, email);

  const options = {
    overwrite: true,
    dot: true,
    transform: (src, dest, stats) => {
      return through((chunk, enc, done) =>  {
        const output = renderTemplate(chunk.toString());
        done(null, output);
      });
    }
  };

  try {
    await copy(templatesPath, dirPath, options)
      .on(copy.events.COPY_FILE_START, copyOperation => {
        console.log(`Generate ${copyOperation.dest}...`);
      });
  } catch (error) {
    showError(`Generate failed: ${error}\nPlease clean current directory and retry !`);
  }

  PImage.encodeJPEGToStream(
    createCover(name),
    fs.createWriteStream(path.resolve(dirPath, 'cover.jpg'))
  );
}

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.write('Set information for your effect:\n');

rl.question('Name of your effect: ', name => {
  if (!name) {
    showError('Name can not be empty !');
  }

  if (collection.includes(name)) {
    showError('Effect is existed, check folder "./src/collection" !');
  }

  if (!/^[A-Z].*/.test(name)) {
    showError('Name must be camel case !');
  }
  
  rl.question('Route of your effect: ', route => {
    if (!/[a-z0-9\-]+/.test(route)) {
      showError('route can just contains "lower case", "number" and "-"!');
    }

    rl.question('Description of your effect: ', desc => {

      rl.question('Tags, a comma-separated list: ', tags => {
        if (!/^[A-Za-z0-9]+[,A-Za-z0-9]*$/.test(tags)) {
          showError('Tags must be like "aaa,bbb,ccc" !');
        }
        create(name, route, desc, tags);
    
        rl.close();
      });
    });
  });
});
