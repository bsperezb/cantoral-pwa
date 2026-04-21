import { setup } from '@storybook/vue3-vite';
import { createMemoryHistory, createRouter } from 'vue-router';
import '../src/assets/styles/main.css';

const router = createRouter({
  history: createMemoryHistory(),
  routes: [
    { path: '/', name: 'home', component: { template: '<div />' } },
    { path: '/song/:id', name: 'song-detail', component: { template: '<div />' } },
  ],
});

setup((app) => {
  app.use(router);
});

/** @type { import('@storybook/vue3-vite').Preview } */
const preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      default: 'app',
      values: [
        { name: 'app', value: 'var(--color-bg, #fff)' },
        { name: 'dark', value: '#0f172a' },
      ],
    },
    viewport: {
      viewports: {
        mobile: { name: 'Móvil 360px', styles: { width: '360px', height: '740px' } },
        tablet: { name: 'Tablet', styles: { width: '768px', height: '1024px' } },
      },
    },
  },
};

export default preview;
