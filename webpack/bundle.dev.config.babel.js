import path from 'path'
import webpack from 'webpack'
import pseudoelements from 'postcss-pseudoelements'
import autoprefixer from 'autoprefixer'
import ExtractTextPlugin from 'extract-text-webpack-plugin'
import SvgStore from 'webpack-svgstore-plugin'
import WriteFilePlugin from 'write-file-webpack-plugin';

import createHappyPlugin, { getEnvId } from '../lib/createHappyPlugin'

export default {
  cache: true,
  devtool: 'source-map',
  context: path.resolve(__dirname, '..'),
  progress: true,
  entry: {
    docs: [
      'webpack/hot/dev-server',
      'webpack-hot-middleware/client',
      './docs/js/index-with-styles.js',
    ],
  },
  output: {
    path: path.resolve(__dirname, '../dist'),
    filename: '[name].js',
    chunkFilename: '[name]-[chunkhash].js',
    publicPath: '/dist/',
  },
  resolve: {
    modulesDirectories: [
      'node_modules',
    ],
    extensions: ['', '.js', '.jsx'],
  },
  module: {
    loaders: [{
      test: /\.jsx?$/,
      exclude: /node_modules/,
      loader: `happypack/loader?id=${getEnvId('jsx')}`,
    }, {
      test: /\.scss$/,
      // loader: `happypack/loader?id=${getEnvId('sass')}`,
      loader: ExtractTextPlugin.extract('style', [
        'css?importLoaders=2&sourceMap',
        'postcss-loader',
        // 'custom-postcss',
        'sass-loader-once?outputStyle=expanded&sourceMap=true&sourceMapContents=true',
      ]),
    }],
    noParse: [
      'jquery',
      // 'react',
      // 'react-dom',
      'baconjs',
      'moment',
      'classnames',
      // 'svg4everybody',
      'zeroclipboard',
      // 'iframe-resizer',
      'lunr',
      'slick-carousel',
    ].map((module) => new RegExp(require.resolve(module))),
  },
  plugins: [
    createHappyPlugin('jsx', [
      'react-hot-loader/webpack',
      'babel?cacheDirectory=true',
      'webpack-module-hot-accept',
    ]),
    // createHappyPlugin('sass', [
    //   'style',
    //   'css?importLoaders=2&sourceMap',
    //   'postcss-loader',
    //   'sass?outputStyle=expanded&sourceMap=true&sourceMapContents=true',
    // ]),
    // Force write to disk for browser-sync css hot reloading
    new WriteFilePlugin({ test: /\.css$/ }),
    new ExtractTextPlugin('[name].css', {
      publicPath: '/dist/',
      allChunks: true,
    }),
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NoErrorsPlugin(),
    new SvgStore({
      svgoOptions: {
        plugins: [{ removeTitle: true }],
      },
      name: 'dist/icons.svg',
      prefix: '',
    }),
  ],
  postcss: () => [
    pseudoelements,
    autoprefixer,
  ],
}
