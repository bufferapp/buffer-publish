const babelConfig = require('./babel.config.js');
require('@babel/register')(babelConfig);
require('core-js/stable');
require('regenerator-runtime/runtime');

const { analyzePackagesWhitelist } = require('./analyze.config.js');

const publishPackages = [
  'async-data-fetch',
  'publish-composer',
  'components',
  'notifications',
  'web-components',
  'unauthorized-redirect',
  'app-sidebar',
];

const publishPackagesWhitelist = publishPackages.map(imp => `(?!/@bufferapp/${imp})`).join('');

module.exports = {
  verbose: true,
  transformIgnorePatterns: [
    `/node_modules${publishPackagesWhitelist}${analyzePackagesWhitelist}`,
  ],
  collectCoverage: true,
  moduleNameMapper: {
    '\\.(css|less)$': 'identity-obj-proxy',
  },
  moduleFileExtensions: ['js', 'json', 'jsx'],
  setupFiles: [
    '<rootDir>/.jest/jest-raf-shim.js',
    '<rootDir>/.jest/require-context.js',
  ],
  setupFilesAfterEnv: ['<rootDir>/setupEnzyme.js'],
  globals: {
    __PACKAGES__: '../packages',
  },
  testPathIgnorePatterns: [
    'package/sidebar/node_modules',
  ],
  testURL: 'https://publish.local.buffer.com',
};
