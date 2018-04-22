#!/usr/bin/env node
/**
 * @File   : webpack.dev.js
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 2018-4-4 16:50:35
 * @Link: dtysky.moe
 */
const webpack = require('webpack');
const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const CompressionWebpackPlugin = require('compression-webpack-plugin');

const outPath = path.resolve(__dirname, 'dist');
const phaserModule = path.join(__dirname, './node_modules/phaser-ce/');
const phaser = path.join(phaserModule, 'build/custom/phaser-split.js');
const pixi = path.join(phaserModule, 'build/custom/pixi.js');
const p2 = path.join(phaserModule, 'build/custom/p2.js');

module.exports = {
  entry: {
    main: path.resolve(__dirname, './src/index.tsx'),
    'react-packet': ['react', 'react-dom', 'react-router'],
    three: ['three'],
    phaser: ['pixi', 'p2', 'phaser-ce']
  },

  output: {
    path: outPath,
    filename: '[name].js',
    publicPath: '/'
  },

  resolve: {
    extensions: [".ts", ".tsx", ".js", ".md"],
    alias: {
      'gl-matrix': path.resolve(__dirname, './node_modules/gl-matrix/dist/gl-matrix.js'),
      'phaser-ce': phaser,
      p2,
      pixi
    }
  },

  externals: {
    'fs': true,
    'path': true,
  },
  
  module: {
    rules: [
      {
        test: /pixi\.js/,
        use: ['expose-loader?PIXI']
      },
      {
        test: /phaser-split\.js$/,
        use: ['expose-loader?Phaser']
      },
      {
        test: /p2\.js/,
        use: ['expose-loader?p2']
      },
      {
        enforce: 'pre',
        test: /\.tsx?$/,
        use: [
          {
            loader: "awesome-typescript-loader"
          },
          {
            loader: 'tslint-loader',
            query: {
              configFile: path.resolve(__dirname, './tslintConfig.js')
            }
          }
        ],
        exclude: /node_modules/
      },
      {
        test: /\.(css|scss)$/,
        use: ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: [
            {
              loader: 'css-loader'
            },
            {
              loader: 'postcss-loader'
            },
            {
              loader: 'sass-loader'
            }
          ]
        }),
      },
      {
        test: /\.md$/,
        use: [
          {
            loader: 'raw-loader'
          }
        ]
      },
      {
        test: /\.(png|jpg|gif|svg|mp4)$/,
        use: {
          loader: 'url-loader',
          query: {
            limit: 15000,
//             emitFile: false
//             name: 'static/images/[name].[ext]'
          }
        }
      },
      {
        test: /\.json$/,
        use: {
          loader: 'json-loader'
        }
      }
    ]
  },

  plugins: [
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('development'),
        BROWSER: JSON.stringify(true)
      }
    }),
    new CleanWebpackPlugin(
      ['*'],
      {root: outPath}
    ),
    new ExtractTextPlugin({
      filename: 'main.css',
      allChunks: true
    }),
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: JSON.stringify('production')
      }
    }),
    new webpack.optimize.CommonsChunkPlugin({
      name: ['react-packet', 'three', 'phaser'],
      minChunks: 2
    }),
    new HtmlWebpackPlugin({
      template: './index.html'
    }),
    new CompressionWebpackPlugin({
      asset: "[path]",
      algorithm: "gzip",
      test: /\.js$|\.css$/,
      threshold: 10240,
      minRatio: 0.8
    })
  ]
};
