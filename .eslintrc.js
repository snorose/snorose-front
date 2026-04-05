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
          ['^@/axios/(.*)$'],
          ['^@/apis/(.*)$'],
          ['^@/shared/(.*)$'],
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
