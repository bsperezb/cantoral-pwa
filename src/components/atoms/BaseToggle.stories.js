import { ref } from 'vue';
import BaseToggle from './BaseToggle.vue';

export default {
  title: 'Atoms/BaseToggle',
  component: BaseToggle,
  tags: ['autodocs'],
  args: { modelValue: false, label: 'Modo oscuro', disabled: false },
  render: (args) => ({
    components: { BaseToggle },
    setup() {
      const value = ref(args.modelValue);
      return { args, value };
    },
    template: `<BaseToggle v-bind="args" v-model="value" />`,
  }),
};

export const Off = {};
export const On = { args: { modelValue: true } };
export const Disabled = { args: { disabled: true } };
export const NoLabel = { args: { label: '' } };
