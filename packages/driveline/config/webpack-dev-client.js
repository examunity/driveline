// Webpack config for development
const webpack = require('webpack');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const NodePolyfillPlugin = require('node-polyfill-webpack-plugin');
const LoadablePlugin = require('@loadable/webpack-plugin');
const { WebpackManifestPlugin } = require('webpack-manifest-plugin');
const path = require('path');
const paths = require('./paths');
const webpackBaseConfig = require('./webpack');

module.exports = (config) => {
  const { host, port } = config.devServer;
  const baseConfig = webpackBaseConfig(true, true);

  return {
    ...baseConfig,
    entry: [
      `${require.resolve(
        'webpack-hot-middleware/client',
      )}?path=http://${host}:${port}/__webpack_hmr`,
      paths.drivelineClientEntry,
    ],
    output: {
      path: paths.appAssets,
      pathinfo: false,
      filename: '[name]-[chunkhash].js',
      chunkFilename: '[name]-[chunkhash].chunk.js',
      publicPath: `http://${host}:${port}/dist/`,
    },
    plugins: [
      // hot reload
      new webpack.HotModuleReplacementPlugin(),

      // react fash refresh
      new ReactRefreshWebpackPlugin({
        overlay: false,
      }),

      // polyfill node modules
      new NodePolyfillPlugin(),

      // define constants
      new webpack.DefinePlugin({
        __DEV__: true,
      }),

      // add support for loadable components
      new LoadablePlugin({
        filename: 'loadable-stats.json',
        outputAsset: false,
        writeToDisk: { filename: path.join(paths.appCache, 'dev') },
      }),

      new WebpackManifestPlugin({
        fileName: path.join(paths.appCache, 'dev', 'webpack-manifest.json'),
        writeToFileEmit: true,
      }),
    ],
    watchOptions: {
      ignored: /node_modules/,
    },
    // Turn off performance hints during development because we don't do any
    // splitting or minification in interest of speed. These warnings become
    // cumbersome.
    performance: {
      hints: false,
    },
  };
};
