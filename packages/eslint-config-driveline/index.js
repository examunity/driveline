module.exports = {
  extends: ['airbnb', 'prettier'],
  env: {
    browser: true,
    node: true,
    es6: true,
  },
  globals: {
    __DEV__: 'readonly',
  },
  rules: {
    // eslint
    'arrow-body-style': 'off',
    'no-underscore-dangle': ['error', { allow: ['__typename'] }], // allow for graphql

    // import
    'import/prefer-default-export': 'off',
    'import/extensions': [
      'error',
      'always',
      {
        pattern: {
          js: 'never',
          ts: 'never',
          jsx: 'never',
          tsx: 'never',
        },
      },
    ],

    // jsx-a11y
    'jsx-a11y/anchor-is-valid': 'off',

    // react
    'react/jsx-filename-extension': [
      'error',
      { extensions: ['.js', '.jsx', '.tsx'] },
    ],
    'react/prop-types': 'off', // deprecated
    'react/require-default-props': 'off', // deprecated
    'react/jsx-props-no-spreading': 'off', // we can allow spreading, because objects are well defined by Flow
    'react/jsx-one-expression-per-line': 'off', // conflict with prettier
    'react/jsx-indent': 'off', // conflict with prettier
    'react/jsx-wrap-multilines': 'off', // conflict with prettier
    'react/jsx-closing-tag-location': 'off', // conflict with prettier
  },
  parser: '@babel/eslint-parser',
  parserOptions: {
    requireConfigFile: false,
    babelOptions: {
      presets: [require.resolve('babel-preset-driveline')],
    },
  },
  overrides: [
    {
      files: ['**/*.ts?(x)'],
      extends: ['plugin:@typescript-eslint/recommended'],
      parser: '@typescript-eslint/parser',
      parserOptions: {
        ecmaFeatures: {
          jsx: true,
        },
        warnOnUnsupportedTypeScriptVersion: true,
      },
      plugins: ['@typescript-eslint'],
    },
  ],
  settings: {
    'import/resolver': {
      node: {
        moduleDirectory: ['node_modules', 'app'],
        extensions: ['.js', '.jsx', '.d.ts', '.ts', '.tsx'],
      },
    },
  },
};
