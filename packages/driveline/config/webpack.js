const path = require('path');
const fs = require('fs');
const TerserPlugin = require('terser-webpack-plugin');
const paths = require('./paths');

const includePaths = [
  paths.appMain,
  path.join(paths.appNodeModules, 'driveline/src'),
];

// Parts of this config are forked from the great create-react-app package
// ref: https://github.com/facebook/create-react-app/blob/main/packages/react-scripts/config/webpack.config.js
module.exports = (isDev, isClient) => {
  if (!fs.existsSync(paths.appBabelConfig)) {
    throw new Error(
      'Driveline: Babel config file "babel.config.js" not found.',
    );
  }

  return {
    mode: isDev ? 'development' : 'production',
    target: isClient ? 'web' : 'node',
    devtool: isDev ? 'eval-cheap-module-source-map' : false,
    context: paths.appRoot,
    infrastructureLogging: {
      level: 'warn',
    },
    module: {
      unsafeCache: isDev,
      rules: [
        // Process JS/TS with Babel.
        {
          test: /\.(js|jsx|ts|tsx)$/,
          include: includePaths,
          use: [
            {
              loader: 'babel-loader',
              options: {
                plugins: [
                  isDev && isClient && require.resolve('react-refresh/babel'),
                ].filter(Boolean),
                cacheDirectory: isDev
                  ? path.join(paths.appCache, 'babel-loader')
                  : false,
              },
            },
          ],
        },
        // Load CSS files.
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader'],
        },
      ],
    },
    // Resolve node modules from node_modules app and driveline directory
    resolveLoader: {
      modules: [
        'node_modules',
        paths.drivelineNodeModules,
        paths.appNodeModules,
      ],
    },
    resolve: {
      modules: [paths.appMain, 'node_modules', paths.appNodeModules],
      alias: {
        '@@entry': isClient ? paths.appClientEntry : paths.appServerEntry,
        // Add alias for AssetRegistry for Expo SDK 48 compatibility
        'react-native/Libraries/Image/AssetRegistry$':
          'react-native-web/dist/modules/AssetRegistry',
        'react-native': 'react-native-web',
        // Add react and react-dom aliases, so that it's always the same instance
        react: path.join(paths.appNodeModules, 'react'),
        'react-dom': path.join(paths.appNodeModules, 'react-dom'),
      },
      extensions: [
        '.json',
        '.web.js',
        '.js',
        '.web.jsx',
        '.jsx',
        '.web.ts',
        '.ts',
        '.web.tsx',
        '.tsx',
      ],
    },
    externalsPresets: isClient ? {} : { node: true },
    // Workaround for https://github.com/react-pdf-viewer/react-pdf-viewer/issues/1203
    externals: isClient ? {} : { canvas: 'canvas' },
    // Optimize production build
    optimization: {
      minimize: !isDev,
      minimizer: [
        // This is only used in production mode
        new TerserPlugin({
          terserOptions: {
            parse: {
              // We want terser to parse ecma 8 code. However, we don't want it
              // to apply any minification steps that turns valid ecma 5 code
              // into invalid ecma 5 code. This is why the 'compress' and 'output'
              // sections only apply transformations that are ecma 5 safe
              // https://github.com/facebook/create-react-app/pull/4234
              ecma: 8,
            },
            compress: {
              ecma: 5,
              warnings: false,
              // Disabled because of an issue with Uglify breaking seemingly valid code:
              // https://github.com/facebook/create-react-app/issues/2376
              // Pending further investigation:
              // https://github.com/mishoo/UglifyJS2/issues/2011
              comparisons: false,
              // Disabled because of an issue with Terser breaking valid code:
              // https://github.com/facebook/create-react-app/issues/5250
              // Pending further investigation:
              // https://github.com/terser-js/terser/issues/120
              inline: 2,
            },
            mangle: {
              safari10: true,
            },
            // Added for profiling in devtools
            keep_classnames: true,
            keep_fnames: true,
            output: {
              ecma: 5,
              comments: false,
              // Turned on because emoji and regex is not minified properly using default
              // https://github.com/facebook/create-react-app/issues/2488
              ascii_only: true,
            },
          },
        }),
      ],
    },
  };
};
