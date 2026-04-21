import { ref } from 'vue';
import SearchBar from './SearchBar.vue';

export default {
  title: 'Molecules/SearchBar',
  component: SearchBar,
  tags: ['autodocs'],
  args: { modelValue: '', placeholder: 'Buscar canto...', debounce: 150 },
  render: (args) => ({
    components: { SearchBar },
    setup() {
      const value = ref(args.modelValue);
      return { args, value };
    },
    template: `
      <div>
        <SearchBar v-bind="args" v-model="value" />
        <p style="margin-top:12px;font-size:14px;color:var(--color-text-muted)">
          Valor emitido: <code>{{ value || '(vacío)' }}</code>
        </p>
      </div>
    `,
  }),
};

export const Default = {};
export const Prefilled = { args: { modelValue: 'aleluya' } };
