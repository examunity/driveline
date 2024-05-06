module.exports = (api) => {
  // Detect expo usage
  const isExpo = !api.caller((caller) => caller && caller.name === 'babel-loader');

  if (!isExpo) {
    return {
      presets: ['driveline'],
    };
  }

  return {
    presets: ['babel-preset-expo'],
  };
};
