const path = require('path');
require('webpack');

module.exports = {
  entry: './index.js',
  output: {
    path: path.resolve(__dirname, 'public'),
    filename: 'bundle.js'
  },
  module: {
    loaders: [
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
          presets: ['env', 'react']
        }
      }
    ]
    },

  //workaround to silence module not found errors
  node: {
      fs: "empty",
      net: "empty"
    },
  stats: {
    colors: true
    },
  devtool: 'source-map'
 };