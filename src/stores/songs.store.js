import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { createSongRepository } from '../services/songRepository.js';
import { fetchManifest, fetchSongRaw } from '../services/songLoader.js';

const repo = createSongRepository();

export const useSongsStore = defineStore('songs', () => {
  const manifest = ref([]); // [{id, file, title, artist, tags, hash, size}, ...]
  const manifestLoadedAt = ref(null);
  const loadingManifest = ref(false);
  const error = ref(null);

  async function loadManifest() {
    loadingManifest.value = true;
    error.value = null;
    try {
      const data = await fetchManifest();
      manifest.value = data.songs ?? [];
      manifestLoadedAt.value = data.generatedAt ?? new Date().toISOString();
    } catch (err) {
      error.value = err.message;
    } finally {
      loadingManifest.value = false;
    }
  }

  async function getSong(id) {
    const cached = await repo.get(id);
    if (cached) return cached;
    const entry = manifest.value.find((s) => s.id === id);
    if (!entry) throw new Error(`Canto desconocido: ${id}`);
    const raw = await fetchSongRaw(entry.file);
    return repo.save(id, raw, { hash: entry.hash, size: entry.size });
  }

  const byId = computed(() => {
    const map = new Map();
    for (const s of manifest.value) map.set(s.id, s);
    return map;
  });

  return {
    manifest,
    manifestLoadedAt,
    loadingManifest,
    error,
    byId,
    loadManifest,
    getSong,
    repo,
  };
});
