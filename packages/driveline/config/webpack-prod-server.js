// Webpack config for creating the production bundle.
const webpack = require('webpack');
const path = require('path');
const paths = require('./paths');
const webpackBaseConfig = require('./webpack');

module.exports = () => {
  const baseConfig = webpackBaseConfig(false, false);

  return {
    ...baseConfig,
    entry: paths.drivelineServerEntry,
    output: {
      path: path.join(paths.appCache, 'prod', 'server'),
      filename: 'server-bundle.js',
      library: {
        type: 'commonjs2',
      },
    },
    plugins: [
      // disable code splitting for server code
      new webpack.optimize.LimitChunkCountPlugin({
        maxChunks: 1,
      }),

      // define constants
      new webpack.DefinePlugin({
        __DEV__: false,
      }),
    ],
  };
};
