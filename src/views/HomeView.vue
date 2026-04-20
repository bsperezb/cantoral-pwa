<script setup>
import { computed, onMounted, ref } from 'vue';
import { useSongsStore } from '../stores/songs.store.js';
import { useCategoriesStore } from '../stores/categories.store.js';
import { useSearch } from '../composables/useSearch.js';
import SearchBar from '../components/molecules/SearchBar.vue';
import CategoryFilter from '../components/molecules/CategoryFilter.vue';
import SongList from '../components/organisms/SongList.vue';

const songsStore = useSongsStore();
const categoriesStore = useCategoriesStore();
const selectedCategory = ref(null);
const downloadedIds = ref(new Set());

const filteredSongs = computed(() => {
  if (!selectedCategory.value) return songsStore.manifest;
  return songsStore.manifest.filter((s) => (s.tags ?? []).includes(selectedCategory.value));
});

const { query, results } = useSearch(filteredSongs);

onMounted(async () => {
  await songsStore.loadManifest();
  await categoriesStore.load();
  downloadedIds.value = await songsStore.repo.downloadedIds();
});
</script>

<template>
  <div class="home">
    <SearchBar v-model="query" />

    <CategoryFilter
      :categories="categoriesStore.categories"
      :selected-id="selectedCategory"
      @select="selectedCategory = $event"
    />

    <p v-if="songsStore.loadingManifest" class="home__status">Cargando cantos…</p>
    <p v-else-if="songsStore.error" class="home__status home__status--error">
      {{ songsStore.error }}
    </p>

    <SongList v-else :songs="results" :downloaded-ids="downloadedIds" />
  </div>
</template>

<style scoped>
.home {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}
.home__status {
  text-align: center;
  color: var(--color-text-muted);
  padding-block: var(--space-6);
}
.home__status--error {
  color: var(--color-danger);
}
</style>
