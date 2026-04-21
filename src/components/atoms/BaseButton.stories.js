import BaseButton from './BaseButton.vue';

export default {
  title: 'Atoms/BaseButton',
  component: BaseButton,
  tags: ['autodocs'],
  argTypes: {
    variant: { control: 'select', options: ['primary', 'secondary', 'ghost', 'danger'] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    disabled: { control: 'boolean' },
    iconOnly: { control: 'boolean' },
    onClick: { action: 'click' },
  },
  args: {
    variant: 'primary',
    size: 'md',
    disabled: false,
    iconOnly: false,
  },
  render: (args) => ({
    components: { BaseButton },
    setup: () => ({ args }),
    template: `<BaseButton v-bind="args" @click="args.onClick">Guardar canto</BaseButton>`,
  }),
};

export const Primary = {};
export const Secondary = { args: { variant: 'secondary' } };
export const Ghost = { args: { variant: 'ghost' } };
export const Danger = { args: { variant: 'danger' } };
export const Small = { args: { size: 'sm' } };
export const Large = { args: { size: 'lg' } };
export const Disabled = { args: { disabled: true } };
