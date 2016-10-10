import os from 'os'
import path from 'path'
import CleanPlugin from 'clean-webpack-plugin'
import ExtractTextPlugin from 'extract-text-webpack-plugin'
import SvgStore from 'webpack-svgstore-plugin'
import UglifyJsParallelPlugin from 'webpack-uglify-parallel'

import createHappyPlugin, { getEnvId } from '../lib/createHappyPlugin'

export default {
  cache: true,
  devtool: 'source-map',
  context: path.resolve(__dirname, '..'),
  progress: true,
  entry: {
    docs: './docs/js/index-with-styles.js',
    all: ['./js/index-with-styles.js'],
    jquery: ['./js/jquery/index.js'],
    react: ['./js/react/index.js'],
  },
  output: {
    path: path.resolve(__dirname, '../dist/bundles'),
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
      // loader: ExtractTextPlugin.extract('style', `happypack/loader?id=${getEnvId('sass')}`),
      loader: ExtractTextPlugin.extract('style', [
        'css?importLoaders=2&sourceMap',
        'custom-postcss',
        'sass?outputStyle=expanded&sourceMap=true&sourceMapContents=true',
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
    createHappyPlugin('jsx', ['babel?cacheDirectory=true']),
    // createHappyPlugin('sass', [
    //   'css?importLoaders=2&sourceMap',
    //   'custom-postcss',
    //   'sass?outputStyle=expanded&sourceMap=true&sourceMapContents=true',
    // ]),
    new CleanPlugin([
      path.resolve(__dirname, '../dist/bundles'),
    ], {
      root: path.resolve(__dirname, '..'),
    }),
    new ExtractTextPlugin('[name].css', {
      allChunks: true,
    }),
    new SvgStore({
      svgoOptions: {
        plugins: [{ removeTitle: true }],
      },
      prefix: '',
    }),
    new UglifyJsParallelPlugin({
      workers: os.cpus().length,
    }),
  ],
  resolveLoader: {
    alias: { // custom-postcss is used because there is no way to pass it to happypack otherwise
      'custom-postcss': path.join(__dirname, './custom-postcss.js'),
    },
  },
}
