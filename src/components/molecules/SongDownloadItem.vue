<script setup>
import BaseToggle from '../atoms/BaseToggle.vue';
import BaseTag from '../atoms/BaseTag.vue';

defineProps({
  song: { type: Object, required: true },
  downloaded: { type: Boolean, default: false },
  loading: { type: Boolean, default: false },
});
defineEmits(['toggle']);

function formatSize(bytes) {
  if (!bytes) return '';
  if (bytes < 1024) return `${bytes} B`;
  return `${(bytes / 1024).toFixed(1)} KB`;
}
</script>

<template>
  <li class="song-download-item">
    <div class="song-download-item__info">
      <p class="song-download-item__title">{{ song.title }}</p>
      <p v-if="song.artist" class="song-download-item__artist">{{ song.artist }}</p>
    </div>
    <div class="song-download-item__meta">
      <BaseTag v-if="downloaded" tone="success">✓ Offline</BaseTag>
      <small>{{ formatSize(song.size) }}</small>
      <BaseToggle
        :model-value="downloaded"
        :disabled="loading"
        aria-label="Descargar canto"
        @update:model-value="$emit('toggle', song)"
      />
    </div>
  </li>
</template>

<style scoped>
.song-download-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-3);
  padding: var(--space-3) var(--space-4);
  border-bottom: 1px solid var(--color-border);
  list-style: none;
}
.song-download-item__info {
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
  flex: 1;
}
.song-download-item__title {
  margin: 0;
  font-weight: 500;
  font-size: var(--font-size-base);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.song-download-item__artist {
  margin: 0;
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
}
.song-download-item__meta {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  flex-shrink: 0;
}
.song-download-item__meta small {
  color: var(--color-text-muted);
  font-size: var(--font-size-xs);
}
</style>
