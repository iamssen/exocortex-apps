import type { StorybookConfig } from '@storybook/react-vite';
import react from '@vitejs/plugin-react';
import autoprefixer from 'autoprefixer';
import { mergeConfig } from 'vite';

const config: StorybookConfig = {
  stories: [
    // '../**/*.mdx',
    '../common/**/*.stories.@(js|jsx|mjs|ts|tsx)',
  ],
  addons: ['@storybook/addon-a11y', '@storybook/addon-docs'],
  framework: '@storybook/react-vite',
  async viteFinal(viteConfig) {
    return mergeConfig(viteConfig, {
      css: {
        postcss: {
          plugins: [autoprefixer({})],
        },
      },
      plugins: [react()],
    });
  },
};
export default config;
