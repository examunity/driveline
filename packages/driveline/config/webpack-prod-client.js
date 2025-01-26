// Webpack config for creating the production bundle.
const webpack = require('webpack');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');
const LoadablePlugin = require('@loadable/webpack-plugin');
const { WebpackManifestPlugin } = require('webpack-manifest-plugin');
const path = require('path');
const paths = require('./paths');
const webpackBaseConfig = require('./webpack');

module.exports = () => {
  const baseConfig = webpackBaseConfig(false, true);

  return {
    ...baseConfig,
    entry: paths.drivelineClientEntry,
    output: {
      path: paths.appAssets,
      filename: '[name]-[chunkhash].js',
      chunkFilename: '[name]-[chunkhash].chunk.js',
      publicPath: '/dist/',
    },
    plugins: [
      // clean old dist files
      new CleanWebpackPlugin(),

      // polyfill node modules
      new NodePolyfillPlugin(),

      // define constants
      new webpack.DefinePlugin({
        __DEV__: false,
      }),

      // add support for loadable components
      new LoadablePlugin({
        filename: 'loadable-stats.json',
        outputAsset: false,
        writeToDisk: { filename: path.join(paths.appCache, 'prod', 'client') },
      }),

      new WebpackManifestPlugin({
        fileName: path.join(
          paths.appCache,
          'prod',
          'client',
          'webpack-manifest.json',
        ),
      }),
    ],
  };
};
