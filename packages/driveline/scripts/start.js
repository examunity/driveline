const path = require('path');
const Express = require('express');
const http = require('http');
const fs = require('fs');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const paths = require('../config/paths');

const hashMap = [];

module.exports = function start(config) {
  if (!config.host || !config.port) {
    throw new Error(
      'Driveline Server: No port or host config variable has been specified.',
    );
  }

  // create server
  const app = new Express();
  const server = new http.Server(app);

  if (config.middleware) {
    app.use(config.middleware);
  }

  // compression middleware
  app.use(compression());

  // static directory middleware
  app.use(Express.static(paths.appPublic));

  // parse cookies
  app.use(cookieParser());

  // app entry
  app.use((req, res) => {
    const outputPath = path.join(
      paths.appCache,
      process.env.NODE_ENV === 'development' ? 'dev' : 'prod',
      'server',
    );

    if (process.env.NODE_ENV === 'development') {
      // Clear webpack cache
      // Note that using delete require.cache results in a memory leak, so this should only be used
      // in development.
      Object.keys(require.cache).forEach((key) => {
        if (key.startsWith(outputPath)) {
          delete require.cache[key];
        }
      });
    }

    const hash =
      process.env.NODE_ENV !== 'development' && config.resolveProductionHash
        ? config.resolveProductionHash(req, res)
        : null;

    const defaultFilename = 'server-bundle.js';
    const filename = hash ? `server-bundle.${hash}.js` : defaultFilename;

    // Create one bundle per hash, so that hash uses its own code.
    if (hash && !hashMap.find((h) => h === hash)) {
      hashMap.push(hash);

      fs.copyFileSync(
        path.join(outputPath, defaultFilename),
        path.join(outputPath, filename),
      );
    }

    const entry = path.join(outputPath, filename);

    // eslint-disable-next-line global-require, import/no-unresolved, import/no-dynamic-require
    const createReactAppOnServer = require(entry).default;

    createReactAppOnServer(req, res);
  });

  // start server
  server.listen(config.port, config.host, (err) => {
    if (err) {
      // eslint-disable-next-line no-console
      console.error(err);
    } else {
      // eslint-disable-next-line no-console
      console.info(
        `\n~~> App server running on port ${config.port}.\n    Open`,
        `\x1b[36mhttp://localhost:${config.port}\x1b[0m`,
        'in a browser to view the app.\n',
      );
    }
  });
};
