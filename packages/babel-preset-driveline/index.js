module.exports = (api, opts) => {
  const { typescript = true, flow = true, expo = false, root = './app' } = opts;

  const commonPlugins = [
    [
      require.resolve('@loadable/babel-plugin'),
      {
        signatures: [{ name: 'default', from: 'driveline/lazy' }],
      },
    ],
    [
      require.resolve('babel-plugin-intlized-components'),
      { ignoreImport: true, autoResolveKey: root },
    ],
  ];

  if (expo) {
    return {
      plugins: commonPlugins,
    };
  }

  return {
    presets: [
      require.resolve('@babel/preset-env'),
      require.resolve('@babel/preset-react'),
      typescript && require.resolve('@babel/preset-typescript'),
      flow && require.resolve('@babel/preset-flow'),
    ].filter(Boolean),
    plugins: [
      ...commonPlugins,
      [
        require.resolve('babel-plugin-module-resolver'),
        {
          root,
        },
      ],
      require.resolve('babel-plugin-react-native-web'),
    ],
  };
};
