import { ref } from 'vue';
import CategoryFilter from './CategoryFilter.vue';

const CATEGORIES = [
  { id: 'entrada', name: 'Entrada' },
  { id: 'ofertorio', name: 'Ofertorio' },
  { id: 'comunion', name: 'Comunión' },
  { id: 'salida', name: 'Salida' },
  { id: 'adoracion', name: 'Adoración' },
];

export default {
  title: 'Molecules/CategoryFilter',
  component: CategoryFilter,
  tags: ['autodocs'],
  args: { categories: CATEGORIES, selectedId: null },
  render: (args) => ({
    components: { CategoryFilter },
    setup() {
      const selected = ref(args.selectedId);
      return { args, selected };
    },
    template: `<CategoryFilter :categories="args.categories" :selected-id="selected" @select="selected = $event" />`,
  }),
};

export const Default = {};
export const WithSelection = { args: { selectedId: 'comunion' } };
export const Empty = { args: { categories: [] } };
