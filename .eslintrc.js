/* eslint-env node */

require('@uniswap/eslint-config/load')

module.exports = {
  extends: ['@uniswap/eslint-config/react', 'plugin:@next/next/core-web-vitals', 'plugin:@next/next/recommended'],
  rules: {
    'import/no-unused-modules': 0,
  },
}
