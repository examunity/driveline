module.exports = (api, opts) => {
  const { typescript = true, flow = true, root = './app' } = opts;

  return {
    presets: [
      require.resolve('@babel/preset-env'),
      require.resolve('@babel/preset-react'),
      typescript && require.resolve('@babel/preset-typescript'),
      flow && require.resolve('@babel/preset-flow'),
    ].filter(Boolean),
    plugins: [
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
      [
        require.resolve('babel-plugin-module-resolver'),
        {
          root,
        },
      ],
    ],
  };
};
