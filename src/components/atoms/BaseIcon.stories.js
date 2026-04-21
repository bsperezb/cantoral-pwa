import BaseIcon from './BaseIcon.vue';

const ICON_NAMES = [
  'search',
  'close',
  'plus',
  'minus',
  'download',
  'trash',
  'check',
  'settings',
  'music',
  'back',
  'folder',
  'wifi-off',
];

export default {
  title: 'Atoms/BaseIcon',
  component: BaseIcon,
  tags: ['autodocs'],
  argTypes: {
    name: { control: 'select', options: ICON_NAMES },
    size: { control: { type: 'number', min: 12, max: 64, step: 2 } },
  },
  args: { name: 'music', size: 24 },
};

export const Default = {};

export const Gallery = {
  render: () => ({
    components: { BaseIcon },
    setup: () => ({ names: ICON_NAMES }),
    template: `
      <div style="display:grid;grid-template-columns:repeat(4,1fr);gap:16px;padding:16px">
        <div v-for="n in names" :key="n" style="display:flex;flex-direction:column;align-items:center;gap:4px;font-size:12px">
          <BaseIcon :name="n" :size="28" />
          <code>{{ n }}</code>
        </div>
      </div>
    `,
  }),
};
