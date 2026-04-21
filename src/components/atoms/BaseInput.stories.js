import { ref } from 'vue';
import BaseInput from './BaseInput.vue';

export default {
  title: 'Atoms/BaseInput',
  component: BaseInput,
  tags: ['autodocs'],
  argTypes: {
    type: { control: 'select', options: ['text', 'search', 'email', 'number', 'password'] },
  },
  args: {
    modelValue: '',
    placeholder: 'Escribe algo...',
    label: 'Título del canto',
    type: 'text',
  },
  render: (args) => ({
    components: { BaseInput },
    setup() {
      const value = ref(args.modelValue);
      return { args, value };
    },
    template: `<BaseInput v-bind="args" v-model="value" />`,
  }),
};

export const Default = {};
export const WithoutLabel = { args: { label: '' } };
export const Prefilled = { args: { modelValue: 'Como el ciervo' } };
