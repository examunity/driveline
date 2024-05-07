const Express = require('express');
const webpack = require('webpack');
const webpackDevMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const path = require('path');
const fs = require('fs');
const webpackConfigServer = require('../config/webpack-dev-server');
const webpackConfigClient = require('../config/webpack-dev-client');
const paths = require('../config/paths');

module.exports = function watch(config) {
  // Clear cache directory
  const cacheDir = path.join(paths.appCache, 'dev');
  fs.rmSync(cacheDir, { recursive: true, force: true });

  // Webpack compiler
  const builds = [
    { compiler: webpack(webpackConfigServer()), done: false },
    { compiler: webpack(webpackConfigClient(config)), done: false },
  ];

  const compilerServer = builds[0].compiler;
  const compilerClient = builds[1].compiler;

  // Watch server build
  compilerServer.watch(
    {
      aggregateTimeout: 1000,
      ignored: /node_modules/,
    },
    (err) => {
      if (err) {
        // eslint-disable-next-line no-console
        console.error(err);
      }
    },
  );

  // Create server
  const app = new Express();

  // Create dev server config
  const devServerOptions = {
    publicPath: `http://${config.devServer.host}:${config.devServer.port}/dist/`,
    headers: {
      // In development same origin policy does not matter, so allow all.
      'Access-Control-Allow-Origin': '*',
    },
    stats: {
      preset: 'none',
      errors: true,
      errorDetails: true,
      warnings: true,
      logging: 'warn',
    },
  };

  // Use webpack dev and hot middleware
  app.use(webpackDevMiddleware(compilerClient, devServerOptions));
  app.use(webpackHotMiddleware(compilerClient));

  // Watch client build
  app.listen(config.devServer.port, config.devServer.host, (err) => {
    if (err) {
      // eslint-disable-next-line no-console
      console.error(err);
    } else {
      // eslint-disable-next-line no-console
      console.info(
        `webpack dev server listening on port ${config.devServer.port}...\nwebpack building...`,
      );
    }
  });

  return new Promise((resolve, reject) => {
    builds.forEach((build) => {
      build.compiler.hooks.done.tap('driveline', () => {
        if (!build.done) {
          // eslint-disable-next-line no-param-reassign
          build.done = true;
        }

        if (builds.every((b) => b.done)) {
          resolve();
        }
      });
      build.compiler.hooks.failed.tap('driveline', () => {
        if (builds.some((b) => !b.done)) {
          reject();
        }
      });
    });
  });
};
