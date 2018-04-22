#!/usr/bin/env node
/**
 * @File   : server.dev.js
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 2018-4-4 16:49:53
 * @Link: dtysky.moe
 */
const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');

const pathTable = {};

function camelcase2Dash(str) {
  return str.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
}

function getDirectories(dp) {
  return fs.readdirSync(dp).filter(file => {
      return fs.statSync(path.join(dp, file)).isDirectory() && file.substr(0, 1) !== ".";
  });
}

getDirectories(path.resolve(__dirname, './src/collection'))
  .forEach(dir => {
    pathTable[camelcase2Dash(dir)] = dir;
  });

function dash2Camelcase(str) {
  return pathTable[str];
}

const config = require('./webpack.dev.config');
config.plugins.push(
  new webpack.DefinePlugin({
    'globalEnv': {
      NODE_ENV: JSON.stringify('development'),
//      NODE_ENV: JSON.stringify('production'),
    }
  })
);

const express = require('express');
const app = new express();
const port = 8888;
const proxyPort = port + 1;

app.use((req, res, next) => {
  const regexRes = /^(\/effect\/)([a-zA-Z0-9\-]+)(\/?.+)/.exec(req.url);
  if (regexRes && dash2Camelcase(regexRes[2])) {
    req.url = `${regexRes[1]}${dash2Camelcase(regexRes[2])}${regexRes[3]}`;
  }
  next();
});

app.use('/effect',
  express.static(path.resolve(__dirname, './src/collection'))
);

const devServer = () => {
  const server = new WebpackDevServer(webpack(config), {
    compress: true,
    progress: true,
    hot: true,
    open: true,
    publicPath: config.output.publicPath,
    contentBase: path.resolve(__dirname),
    watchContentBase: true,
    watchOptions: {
      ignored: /node_modules/
    },
    https: false,
    overlay: true,
    historyApiFallback: true,
    proxy: {
      '/effect': {
        target: `http://localhost:${proxyPort}`,
        bypass: (req, res, proxyOptions) => {
          if (!/^\/effect\/([a-zA-Z0-9\-]+)(\/.+)/.test(req.path)) {
            return '/index.html';
          }
        }
      }
    }
  });

  server.listen(port, 'localhost', (error) => {
    if (error) {
      console.log('webpack dev server failed', error);
    }
    console.info('==> 🌎  Listening on port %s. Open up http://localhost:%s/ in your browser.', port, port);
  });
}

app.listen(proxyPort, function(error) {
  if (error) {
    console.error(proxyPort);
  } else {
    console.info('==> 🌎  Listening on port %s. Open up http://localhost:%s/ in your browser.', proxyPort, proxyPort);
  }
});

devServer();
