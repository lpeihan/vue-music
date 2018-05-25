// https://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  parserOptions: {
    parser: 'babel-eslint'
  },
  env: {
    browser: true,
  },
  extends: [
    'plugin:vue/essential', 
    'standard'
  ],
  plugins: [
    'vue'
  ],
  rules: {
    'semi': ['error', 'always'],
    'generator-star-spacing': 'off',
    'space-before-function-paren': 'off',
    'prefer-promise-reject-errors': 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'error' : 'off'
  }
}
