const { analyzePackagesWhitelist } = require('./analyze.config.js');

module.exports = {
  verbose: true,
  transformIgnorePatterns: [
    `/node_modules(?!/@bufferapp/async-data-fetch)(?!/@bufferapp/components)(?!/@bufferapp/notifications)(?!/@bufferapp/web-components)(?!/@bufferapp/publish-composer)(?!/@bufferapp/unauthorized-redirect)(?!/@bufferapp/app-sidebar)${analyzePackagesWhitelist}/`,
  ],
  collectCoverage: true,
  moduleNameMapper: {
    '\\.(css|less)$': 'identity-obj-proxy',
  },
  moduleFileExtensions: ['js', 'json', 'jsx'],
  setupFiles: [
    '<rootDir>/jest-raf-shim.js',
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
