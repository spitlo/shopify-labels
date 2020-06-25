module.exports = {
  root: true,
  env: {
    es6: true,
    browser: true,
  },
  parserOptions: {
    ecmaVersion: 2018,
    sourceType: 'module',
  },
  extends: ['plugin:prettier/recommended'],
  plugins: ['prettier'],
  rules: {
    'eol-last': ['error', 'always'],
    'no-multiple-empty-lines': ['error', { max: 2, maxEOF: 1 }],
  },
}
