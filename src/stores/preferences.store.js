import { defineStore } from 'pinia';
import { ref, watch } from 'vue';
import { useIndexedDB, STORES } from '../composables/useIndexedDB.js';

const db = useIndexedDB();

export const usePreferencesStore = defineStore('preferences', () => {
  const notation = ref('english'); // 'english' | 'latin'
  const theme = ref('auto'); // 'auto' | 'light' | 'dark'
  const fontScale = ref(1);
  const loaded = ref(false);

  async function load() {
    notation.value = (await db.get(STORES.preferences, 'notation')) ?? 'english';
    theme.value = (await db.get(STORES.preferences, 'theme')) ?? 'auto';
    fontScale.value = (await db.get(STORES.preferences, 'fontScale')) ?? 1;
    loaded.value = true;
  }

  watch(notation, (v) => loaded.value && db.put(STORES.preferences, v, 'notation'));
  watch(theme, (v) => loaded.value && db.put(STORES.preferences, v, 'theme'));
  watch(fontScale, (v) => loaded.value && db.put(STORES.preferences, v, 'fontScale'));

  return { notation, theme, fontScale, loaded, load };
});
