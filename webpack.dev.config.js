/**
 * Author: dtysky(dtysky<dtysky@outlook.com>)
 * Github: https://github.com/dtysky
 * Created: 2017/6/11
 */
const webpack = require('webpack');
const path = require('path');

module.exports = {
  entry: [
    'webpack-hot-middleware/client?path=http://localhost:4444/__webpack_hmr&reload=true',
    path.resolve(__dirname, './demo/src/index.tsx')
  ],
  output: {
    path: path.resolve(__dirname),
    filename: 'main.js',
    publicPath: '/'
  },

  resolve: {
    // Add '.ts' and '.tsx' as resolvable extensions.
    extensions: [".ts", ".tsx", ".js"]
  },

  externals: {
    'fs': true,
    'path': true,
  },
  
  module: {
    rules: [
      // All files with a '.ts' or '.tsx' extension will be handled by 'awesome-typescript-loader'.
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
        test: /\.(png|jpg|gif|svg|mp4)$/,
        use: {
          loader: 'url-loader',
          query: {
            limit: 15000,
//             emitFile: false
//             name: 'static/images/[name].[ext]'
          }
        }
      }
    ]
  },

  plugins: [
    new webpack.HotModuleReplacementPlugin(),
    new webpack.ProvidePlugin({})
  ]
};
