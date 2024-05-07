const path = require('path');
const Express = require('express');
const http = require('http');
const compression = require('compression');
const cookieParser = require('cookie-parser');
const httpProxy = require('http-proxy');
const paths = require('../config/paths');

module.exports = function start(config) {
  if (!config.host || !config.port) {
    throw new Error(
      'Driveline Server: No port or host config variable has been specified.',
    );
  }

  // create server
  const app = new Express();
  const server = new http.Server(app);

  // proxy middleware
  config.proxies.forEach((options) => {
    const proxy = httpProxy.createProxyServer(options);

    if (options.ws) {
      server.on('upgrade', (req, socket, head) => {
        proxy.ws(req, socket, head);
      });
    }

    app.use(options.path, (req, res) => {
      proxy.web(req, res, {}, (error) => {
        // add the error handling
        // https://github.com/nodejitsu/node-http-proxy/issues/527
        if (error.code !== 'ECONNRESET') {
          // eslint-disable-next-line no-console
          console.error('proxy error', error);
        }
        if (!res.headersSent) {
          res.writeHead(500, { 'content-type': 'application/json' });
        }

        const json = { error: 'proxy_error', reason: error.message };
        res.end(JSON.stringify(json));
      });
    });
  });

  // compression middleware
  app.use(compression());

  // static directory middleware
  app.use(Express.static(paths.appPublic));

  // parse cookies
  app.use(cookieParser());

  // app entry
  app.use((req, res) => {
    const cacheFolder = path.join(
      paths.appCache,
      process.env.NODE_ENV === 'development' ? 'dev' : 'prod',
      'server',
    );

    // Clear webpack cache
    if (process.env.NODE_ENV === 'development') {
      Object.keys(require.cache).forEach((key) => {
        if (key.startsWith(cacheFolder)) {
          delete require.cache[key];
        }
      });
    }

    const entry = path.join(cacheFolder, 'server-bundle.js');

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
