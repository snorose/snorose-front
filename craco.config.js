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
        // CRA의 jest 27은 package.json "exports"를 읽지 못해 Tiptap 하위 경로(@tiptap/pm/*, @tiptap/core/jsx-runtime)가 ESM·TS 원본으로 잡히므로 빌드된 CommonJS 파일로 연결한다.
        '^@tiptap/pm/(.*)$':
          '<rootDir>/node_modules/@tiptap/pm/dist/$1/index.cjs',
        '^@tiptap/core/jsx-runtime$':
          '<rootDir>/node_modules/@tiptap/core/jsx-runtime/index.cjs',
      },
    },
  },
};
