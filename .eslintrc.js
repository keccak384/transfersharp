/* eslint-env node */

require('@uniswap/eslint-config/load')

module.exports = {
  // @todo create `uniswap/eslint-config/next`
  extends: ['@uniswap/eslint-config/react', 'plugin:@next/next/core-web-vitals', 'plugin:@next/next/recommended'],
  rules: {
    'import/no-unused-modules': 0,
  },
}
