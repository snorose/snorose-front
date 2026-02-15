/** @type { import('@storybook/react-webpack5').StorybookConfig } */

import path from 'path';
import { fileURLToPath } from 'url';

const fileName = fileURLToPath(import.meta.url);
const dirname = path.dirname(fileName);

const config = {
  stories: ['../src/**/*.mdx', '../src/**/*.stories.@(js|jsx|mjs|ts|tsx)'],
  addons: [
    '@storybook/preset-create-react-app',
    '@storybook/addon-onboarding',
    '@storybook/addon-essentials',
    '@chromatic-com/storybook',
    '@storybook/addon-interactions',
  ],
  framework: {
    name: '@storybook/react-webpack5',
    options: {},
  },
  staticDirs: ['../public'],
  webpackFinal: async (config) => {
    config.resolve = config.resolve || {};

    config.resolve.alias = {
      '@': path.resolve(dirname, '../src'),
    };

    // TODO: JS >> TS 마이그레이션 완료 이후 개선 필요
    // Storybook(webpack)이 TS 파일까지 확장자 해석을 하도록 보장
    // - `./foo` 형태 import에서 `foo.ts/tsx`를 찾을 수 있어야 함
    // - `.ts/.tsx`를 `.js`보다 우선하도록 앞쪽에 배치
    const defaultExtensions = Array.isArray(config.resolve.extensions)
      ? config.resolve.extensions
      : [];
    config.resolve.extensions = [
      '.ts',
      '.tsx',
      ...defaultExtensions.filter((ext) => ext !== '.ts' && ext !== '.tsx'),
    ];

    return config;
  },
};

export default config;
