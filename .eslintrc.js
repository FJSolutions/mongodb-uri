module.exports = {
  env: {
    browser: true,
    commonjs: true,
    es2020: true,
  },
  extends: [
    'plugin:@typescript-eslint/recommended',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 11,
  },
  plugins: [
    'adonis',
  ],
  rules: {
    'linebreak-style': ['error', 'windows'],
    'no-console': 'off',
    'brace-style': ['error', 'stroustrup'],
    'object-curly-spacing': ['error', 'always'],
    'max-len': 'off',
    'no-non-null-assertion': 'off',
    'no-explicit-any': 'off',
    'no-var-requires': 'off',
  },
};
