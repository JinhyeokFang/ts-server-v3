module.exports = {
  "ignorePatterns": ["node_modules/*", "*.js"],
  "extends": [
    "airbnb-base",
    "plugin:@typescript-eslint/recommended"
  ],
  "env": {
    "node": true
  },
  "parser": "@typescript-eslint/parser",
  "parserOptions": {
    "ecmaVersion": 2018,
    "sourceType": "module"
  },
  "plugins": [
    "@typescript-eslint/eslint-plugin"
  ],
  "rules": {
    'import/extensions': [ 'error', 'ignorePackages', { js: 'never', jsx: 'never', ts: 'never', tsx: 'never', json: 'never', }, ],
    'class-methods-use-this': 0,
    "no-shadow": [0]
  },
  settings: { 
    'import/resolver': { 
      node: { 
        extensions: ['.js', '.jsx', '.ts', '.tsx'], 
      }, 
    } 
  },
};