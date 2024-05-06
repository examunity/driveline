#!/usr/bin/env node
const sade = require('sade');
const fs = require('fs');
const pkg = require('../package.json');
const paths = require('../config/paths');
const start = require('../scripts/start');
const watch = require('../scripts/watch');
const build = require('../scripts/build');

require('dotenv').config();

const prog = sade('driveline');

prog.version(pkg.version);

const getConfig = (opts) => {
  const config = fs.existsSync(paths.appServerConfig)
    ? // eslint-disable-next-line import/no-dynamic-require, global-require
      require(paths.appServerConfig)
    : {};

  const host = opts.host || config.host || 'localhost';
  const port = Number(opts.port) || Number(config.port) || 3000;
  const proxies = config.proxies || [];

  return { host, port, proxies };
};

// driveline dev
prog
  .command('dev')
  .describe('Run server in dev mode')
  .option('-h, --host', 'Hostname to bind')
  .option('-p, --port', 'Port to bind')
  .action((opts) => {
    process.env.NODE_ENV = 'development';

    const config = getConfig(opts);
    const { host, port } = config;

    watch({
      host,
      port,
      devServer: {
        host,
        port: port + 1,
      },
    }).then(
      () => {
        start(config);
      },
      () => {},
    );
  });

// driveline start
prog
  .command('start')
  .describe('Run server')
  .option('-h, --host', 'Hostname to bind')
  .option('-p, --port', 'Port to bind')
  .action((opts) => {
    process.env.NODE_ENV = 'production';

    start(getConfig(opts));
  });

// driveline build
prog
  .command('build')
  .describe('Build bundle')
  .option('--client-only', 'Build client bundle only')
  .option('--server-only', 'Build server bundle only')
  .action((opts) => {
    process.env.NODE_ENV = 'production';

    let only = null;

    if (opts['client-only']) {
      only = 'CLIENT';
    }

    if (opts['server-only']) {
      only = 'SERVER';
    }

    build({
      only,
    });
  });

prog.parse(process.argv);
