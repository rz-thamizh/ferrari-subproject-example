//
// Refer: https://dev.to/onygami/eslint-and-prettier-for-react-apps-bonus-next-js-and-typescript-3e46
// https://melih193.medium.com/next-js-eslint-setup-tutorial-for-airbnb-config-c2b04183a92a
//

// eslint-disable-next-line no-undef
module.exports = {
  root: true,
  parser: 'babel-eslint',
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:import/errors',
    'plugin:import/warnings',
    'plugin:jsx-a11y/recommended',
    'plugin:react-hooks/recommended',
    'airbnb',
  ],

  env: {
    browser: true,
    commonjs: true,
    es6: true,
    node: true,
  },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  settings: {
    react: {
      version: 'detect',
    },
    'import/resolver': {
      alias: {
        // extensions: ['.js'],
        map: [['@', '.']],
      },
    },
  },
  plugins: [
    'graphql',
  ],

  rules: {
    'no-console': 'off',
    'arrow-body-style': 'off',

    'react/jsx-props-no-spreading': 'off',
    'react/jsx-filename-extension': [1, { extensions: ['.js', '.jsx'] }],
    'import/prefer-default-export': 'off',
    'react/forbid-prop-types': 'off',
    'react/require-default-props': [0, { forbidDefaultForRequired: true }],
    'jsx-a11y/label-has-associated-control': 'off',
    'jsx-a11y/anchor-is-valid': [
      'error',
      {
        components: ['Link'],
        specialLink: ['hrefLeft', 'hrefRight'],
        aspects: ['invalidHref', 'preferButton'],
      },
    ],
    'graphql/template-strings': ['error', {
      env: 'apollo',
    }],
  },
};
