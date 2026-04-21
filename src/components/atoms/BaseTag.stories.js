import BaseTag from './BaseTag.vue';

export default {
  title: 'Atoms/BaseTag',
  component: BaseTag,
  tags: ['autodocs'],
  argTypes: {
    tone: { control: 'select', options: ['neutral', 'primary', 'success', 'danger'] },
  },
  args: { tone: 'neutral' },
  render: (args) => ({
    components: { BaseTag },
    setup: () => ({ args }),
    template: `<BaseTag v-bind="args">adoración</BaseTag>`,
  }),
};

export const Neutral = {};
export const Primary = { args: { tone: 'primary' } };
export const Success = { args: { tone: 'success' } };
export const Danger = { args: { tone: 'danger' } };

export const All = {
  render: () => ({
    components: { BaseTag },
    template: `
      <div style="display:flex;gap:8px;flex-wrap:wrap">
        <BaseTag tone="neutral">neutral</BaseTag>
        <BaseTag tone="primary">primary</BaseTag>
        <BaseTag tone="success">success</BaseTag>
        <BaseTag tone="danger">danger</BaseTag>
      </div>
    `,
  }),
};
