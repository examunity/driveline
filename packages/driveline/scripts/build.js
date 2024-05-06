const webpack = require('webpack');
const path = require('path');
const fs = require('fs');
const webpackConfigClient = require('../config/webpack-prod-client');
const webpackConfigServer = require('../config/webpack-prod-server');
const paths = require('../config/paths');

module.exports = function build(config) {
  // Clear cache directory
  const cacheDir = path.join(paths.appCache, 'prod');
  fs.rmSync(cacheDir, { recursive: true, force: true });

  const webpackConfigs = [];

  if (!config.only || config.only === 'CLIENT') {
    webpackConfigs.push(webpackConfigClient());
  }

  if (!config.only || config.only === 'SERVER') {
    webpackConfigs.push(webpackConfigServer());
  }

  // webpack compiler
  const compiler = webpack(webpackConfigs);

  compiler.run((err, stats) => {
    if (err) {
      // eslint-disable-next-line no-console
      console.error(err);
      return;
    }

    // save client stats to file
    if (!config.only || config.only === 'CLIENT') {
      const json = stats.toJson().children[0];

      fs.writeFile(
        path.join(cacheDir, 'webpack-stats.json'),
        JSON.stringify(json),
        (fileErr) => {
          // eslint-disable-next-line no-console
          if (fileErr) console.log(fileErr);
        },
      );
    }

    // console log stats
    // eslint-disable-next-line no-console
    console.log(
      stats.toString({
        colors: true,
      }),
    );

    compiler.close((closeErr) => {
      // eslint-disable-next-line no-console
      if (closeErr) console.error(closeErr);
    });
  });
};
