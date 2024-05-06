const path = require('path');
const fs = require('fs');

const appRootPath = process.cwd();

const realAppRootPath = fs.realpathSync(appRootPath);

function resolveAppPath(relativePath) {
  return path.resolve(realAppRootPath, relativePath);
}

function resolveDrivelinePath(relativePath) {
  return path.join(__dirname, '..', relativePath);
}

module.exports = {
  appRoot: resolveAppPath('.'),
  appMain: resolveAppPath('app'),
  appClientEntry: resolveAppPath('app/client'),
  appServerEntry: resolveAppPath('app/server'),
  appNodeModules: resolveAppPath('node_modules'),
  appPublic: resolveAppPath('public'),
  appAssets: resolveAppPath('public/dist'),
  appBabelConfig: resolveAppPath('babel.config.js'),
  appServerConfig: resolveAppPath('server.config.js'),
  appCache: resolveAppPath('.driveline'),
  drivelineClientEntry: resolveDrivelinePath('entries/client.js'),
  drivelineServerEntry: resolveDrivelinePath('entries/server.js'),
  drivelineNodeModules: resolveDrivelinePath('node_modules'),
};
