import { defineStore } from 'pinia';
import { ref } from 'vue';
import { useIndexedDB, STORES } from '../composables/useIndexedDB.js';

const DEFAULT_CATEGORIES = [
  {
    id: 'entrada',
    name: 'Entrada',
    subcategories: [
      { id: 'alegre', name: 'Alegre' },
      { id: 'tranquilo', name: 'Tranquilo' },
    ],
  },
  {
    id: 'adoracion',
    name: 'Adoración',
    subcategories: [
      { id: 'intimo', name: 'Íntimo' },
      { id: 'festivo', name: 'Festivo' },
    ],
  },
  {
    id: 'comunion',
    name: 'Comunión',
    subcategories: [
      { id: 'meditativo', name: 'Meditativo' },
      { id: 'gozoso', name: 'Gozoso' },
    ],
  },
  {
    id: 'salida',
    name: 'Salida',
    subcategories: [
      { id: 'mision', name: 'Misión' },
      { id: 'alabanza', name: 'Alabanza' },
    ],
  },
];

const db = useIndexedDB();

export const useCategoriesStore = defineStore('categories', () => {
  const categories = ref([]);

  async function load() {
    const stored = await db.getAll(STORES.categories);
    if (stored.length === 0) {
      for (const cat of DEFAULT_CATEGORIES) await db.put(STORES.categories, cat);
      categories.value = DEFAULT_CATEGORIES;
    } else {
      categories.value = stored;
    }
  }

  return { categories, load };
});
