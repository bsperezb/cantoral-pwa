import BaseProgressBar from './BaseProgressBar.vue';

export default {
  title: 'Atoms/BaseProgressBar',
  component: BaseProgressBar,
  tags: ['autodocs'],
  argTypes: {
    value: { control: { type: 'range', min: 0, max: 100, step: 1 } },
  },
  args: { value: 40, label: 'Descargando cantos' },
};

export const Empty = { args: { value: 0 } };
export const Half = { args: { value: 50 } };
export const AlmostDone = { args: { value: 85 } };
export const Full = { args: { value: 100 } };
