// Webpack config for creating the production bundle.
const webpack = require('webpack');
const path = require('path');
const paths = require('./paths');
const webpackBaseConfig = require('./webpack');

module.exports = () => {
  const baseConfig = webpackBaseConfig(true, false);

  return {
    ...baseConfig,
    entry: paths.drivelineServerEntry,
    output: {
      path: path.join(paths.appCache, 'dev', 'server'),
      pathinfo: false,
      filename: 'server-bundle.js',
      chunkFilename: 'server-bundle.[name].js',
      library: {
        type: 'commonjs2',
      },
    },
    plugins: [
      // hot reload
      new webpack.HotModuleReplacementPlugin(),

      // define constants
      new webpack.DefinePlugin({
        __DEV__: true,
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
