module.exports = {
  env: {
    es6: true,
    node: true,
  },
  extends: ['airbnb-base', 'prettier'],
  plugins: ['prettier'],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
  },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  rules: {
    'prettier/prettier': 'error',
    camelcase: 'off',
    'class-methods-use-this': 'off',
    'no-unused-vars': ['error', { argsIgnorePattern: 'next' }],
    'no-param-reassign': 'off',
  },
};
