#!/usr/bin/env node
/**
 * @File   : webpack.dev.js
 * @Author : dtysky (dtysky@outlook.com)
 * @Date   : 2018-4-4 16:50:35
 * @Link: dtysky.moe
 */
const webpack = require('webpack');
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

const phaserModule = path.join(__dirname, './node_modules/phaser-ce/');
const phaser = path.join(phaserModule, 'build/custom/phaser-split.js');
const pixi = path.join(phaserModule, 'build/custom/pixi.js');
const p2 = path.join(phaserModule, 'build/custom/p2.js');

module.exports = {
  entry: {
    main: [
      'react-hot-loader/patch',
      'webpack-dev-server/client?/',
      'webpack/hot/dev-server',
      path.resolve(__dirname, './src/index.tsx')
    ],
  },

  output: {
    path: path.resolve(__dirname),
    filename: 'main.js',
    chunkFilename: '[name].chunk.js',
    publicPath: '/'
  },

  resolve: {
    extensions: [".ts", ".tsx", ".js", ".md"],
    alias: {'phaser-ce': phaser, p2, pixi}
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
            loader: 'react-hot-loader/webpack'
          },
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
        use: [
          {
            loader: 'style-loader'
          },
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
      },
      {
        test: /\.(md|glsl)$/,
        use: [
          {
            loader: 'raw-loader'
          }
        ]
      },
      {
        test: /\.(png|jpg|gif|svg|mp4)$/,
        exclude: /gltf/,
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
      },
      // GLTF configuration: add this to rules
      {
        // match all .gltf files
        test: /\.gltf$/,
        use: {
          loader: 'gltf-loader-2'
        }
      },
      {
        // here I match only IMAGE and BIN files under the gltf folder
        test: /gltf.*\.(bin|png|jpe?g|gif)$/,
        // or use url-loader if you would like to embed images in the source gltf
        use: {
          loader: 'file-loader',
          options: {
            // output folder for bin and image files, configure as needed
            name: 'gltf/[name].[hash].[ext]'
          }
        }
      }
      // end GLTF configuration
    ]
  },

  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new HtmlWebpackPlugin({
      template: './index.html'
    })
  ]
};
