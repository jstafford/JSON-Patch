var webpack = require('webpack');
const BabiliPlugin = require('babili-webpack-plugin');
const package = require('./package.json');

module.exports = [
  {
    entry: './lib/core.js',
    output: {
      filename: './dist/fast-json-patch.js',
      library: 'jsonpatch',
      libraryTarget: 'var'
    },
    resolve: {
      extensions: ['.js']
    },
    plugins: [
      new webpack.BannerPlugin('fast-json-patch, version: ' + package['version'])
    ]
  },
  {
    entry: './lib/core.js',
    output: {
      filename: './dist/fast-json-patch.min.js',
      library: 'jsonpatch',
      libraryTarget: 'var'
    },
    resolve: {
      extensions: ['.js']
    },
    plugins: [new BabiliPlugin(),
    new webpack.BannerPlugin('fast-json-patch, version: ' + package['version'])
    ]
  }
];
