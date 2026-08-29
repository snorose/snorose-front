const path = require('path');

const axiosPackageRoot = path.dirname(require.resolve('axios/package.json'));

module.exports = {
  webpack: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
  jest: {
    configure: {
      setupFilesAfterEnv: ['<rootDir>/src/setupTests.ts'],
      moduleNameMapper: {
        '^@/(.*)$': '<rootDir>/src/$1',
        '^axios$': path.join(axiosPackageRoot, 'dist/node/axios.cjs'),
      },
    },
  },
};
