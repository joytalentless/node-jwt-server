module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  env: {
    node: true,
  },
  plugins: ['@typescript-eslint', 'prettier'],
  extends: ['plugin:@typescript-eslint/recommended', 'prettier'],
  rules: {
    'no-console': 'off',
    'comma-dangle': 'off',
    'react/jsx-filename-extension': 'off',
    'react/prop-types': 'off',
    '@typescript-eslint/no-var-requires': 'off',
  },
};
