module.exports = {
  ignorePatterns: ['node_modules', 'build', 'dist'],
  extends: ['react-app', 'prettier'],
  plugins: ['simple-import-sort'],
  rules: {
    'simple-import-sort/imports': [
      'warn',
      {
        groups: [
          ['^react(-.*)?$'],
          ['^@?\\w'],
          ['^@/apis/(.*)$'],
          ['^@/shared/(.*)$'],
          ['^@/axios/(.*)$'],
          ['^@/feature/(.*)$'],
          ['^@/page/(.*)$'],
          ['^@/assets/(.*)$'],
          ['^@/style/(.*)$'],
          ['^@/(.*)$'],
          ['^[./]'],
        ],
      },
    ],
    'simple-import-sort/exports': 'warn',
  },
};
