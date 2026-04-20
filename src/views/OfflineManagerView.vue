<script setup>
import { computed, onMounted } from 'vue';
import { useSongsStore } from '../stores/songs.store.js';
import { useOfflineStore } from '../stores/offline.store.js';
import { useOfflineManager } from '../composables/useOfflineManager.js';
import BaseButton from '../components/atoms/BaseButton.vue';
import BaseIcon from '../components/atoms/BaseIcon.vue';
import BaseProgressBar from '../components/atoms/BaseProgressBar.vue';
import SongDownloadItem from '../components/molecules/SongDownloadItem.vue';

const songsStore = useSongsStore();
const offline = useOfflineStore();
const manager = useOfflineManager();

const totalBytes = computed(() =>
  songsStore.manifest
    .filter((s) => offline.downloadedIds.has(s.id))
    .reduce((sum, s) => sum + (s.size ?? 0), 0)
);

const progressPercent = computed(() =>
  offline.progress.total > 0 ? (offline.progress.done / offline.progress.total) * 100 : 0
);

async function toggle(song) {
  if (offline.downloadedIds.has(song.id)) {
    await manager.removeSong(song.id);
  } else {
    await manager.downloadSong(song);
  }
}

function formatBytes(n) {
  if (!n) return '0 KB';
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / 1024 / 1024).toFixed(2)} MB`;
}

onMounted(async () => {
  if (songsStore.manifest.length === 0) await songsStore.loadManifest();
  await manager.refresh();
});
</script>

<template>
  <section class="offline-manager">
    <header class="offline-manager__header">
      <h2>Cantos disponibles offline</h2>
      <p>
        {{ offline.downloadedIds.size }} de {{ songsStore.manifest.length }} descargados ·
        {{ formatBytes(totalBytes) }}
      </p>
    </header>

    <div class="offline-manager__actions">
      <BaseButton variant="primary" @click="manager.downloadAll()">
        <BaseIcon name="download" :size="16" />
        Descargar todo
      </BaseButton>
      <BaseButton variant="ghost" @click="manager.removeAll()">
        <BaseIcon name="trash" :size="16" />
        Eliminar todo
      </BaseButton>
      <BaseButton
        variant="secondary"
        @click="songsStore.loadManifest().then(() => manager.refresh())"
      >
        Refrescar manifest
      </BaseButton>
    </div>

    <BaseProgressBar
      v-if="offline.progress.total > 0 && offline.progress.done < offline.progress.total"
      :value="progressPercent"
      :label="`Descargando ${offline.progress.done} de ${offline.progress.total}`"
    />

    <ul class="offline-manager__list">
      <SongDownloadItem
        v-for="song in songsStore.manifest"
        :key="song.id"
        :song="song"
        :downloaded="offline.downloadedIds.has(song.id)"
        :loading="offline.downloading.has(song.id)"
        @toggle="toggle"
      />
    </ul>
  </section>
</template>

<style scoped>
.offline-manager {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}
.offline-manager__header p {
  color: var(--color-text-muted);
  margin: 4px 0 0;
  font-size: var(--font-size-sm);
}
.offline-manager__actions {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
}
.offline-manager__list {
  list-style: none;
  padding: 0;
  margin: 0;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  overflow: hidden;
}
.offline-manager__list li:last-child {
  border-bottom: none;
}
</style>
