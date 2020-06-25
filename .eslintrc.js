module.exports = {
  root: true,
  extends: ['plugin:prettier/recommended'],
  plugins: ['prettier'],
  rules: {
    'eol-last': ['error', 'always'],
    'no-multiple-empty-lines': ['error', { max: 2, maxEOF: 1 }],
  },
}
