import BaseChip from './BaseChip.vue';

export default {
  title: 'Atoms/BaseChip',
  component: BaseChip,
  tags: ['autodocs'],
  argTypes: {
    active: { control: 'boolean' },
    disabled: { control: 'boolean' },
    onClick: { action: 'click' },
  },
  args: { active: false, disabled: false },
  render: (args) => ({
    components: { BaseChip },
    setup: () => ({ args }),
    template: `<BaseChip v-bind="args" @click="args.onClick">Adoración</BaseChip>`,
  }),
};

export const Default = {};
export const Active = { args: { active: true } };
export const Disabled = { args: { disabled: true } };
