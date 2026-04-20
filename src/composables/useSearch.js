import { computed, ref } from 'vue';

function normalize(str) {
  return (str ?? '')
    .toString()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
}

/**
 * Composable de búsqueda textual sobre el manifest.
 * @param {import('vue').Ref<Array<{title:string, artist?:string|null, tags?:string[]}>>} sourceRef
 */
export function useSearch(sourceRef) {
  const query = ref('');

  const results = computed(() => {
    const q = normalize(query.value.trim());
    if (!q) return sourceRef.value;
    return sourceRef.value.filter((song) => {
      const haystack = [song.title, song.artist, (song.tags ?? []).join(' ')]
        .map(normalize)
        .join(' ');
      return haystack.includes(q);
    });
  });

  return { query, results };
}
