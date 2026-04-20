<script setup>
import { RouterLink } from 'vue-router';
import TagGroup from '../molecules/TagGroup.vue';
import BaseIcon from '../atoms/BaseIcon.vue';

defineProps({
  songs: { type: Array, default: () => [] },
  downloadedIds: { type: Object, default: () => new Set() },
});
</script>

<template>
  <ul v-if="songs.length > 0" class="song-list">
    <li v-for="song in songs" :key="song.id" class="song-list__item">
      <RouterLink :to="{ name: 'song-detail', params: { id: song.id } }" class="song-list__link">
        <div class="song-list__icon" aria-hidden="true">
          <BaseIcon name="music" :size="20" />
        </div>
        <div class="song-list__info">
          <h3 class="song-list__title">{{ song.title }}</h3>
          <p v-if="song.artist" class="song-list__artist">{{ song.artist }}</p>
          <TagGroup v-if="song.tags?.length" :tags="song.tags" />
        </div>
        <div
          v-if="downloadedIds.has(song.id)"
          class="song-list__offline"
          aria-label="Disponible offline"
        >
          <BaseIcon name="check" :size="14" />
        </div>
      </RouterLink>
    </li>
  </ul>
  <div v-else class="song-list__empty">
    <BaseIcon name="music" :size="32" />
    <p>No se encontraron cantos.</p>
  </div>
</template>

<style scoped>
.song-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}
.song-list__link {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3);
  border-radius: var(--radius-md);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  transition:
    background var(--transition-fast),
    transform var(--transition-fast);
}
.song-list__link:hover,
.song-list__link:focus-visible {
  background: var(--color-surface-2);
}
.song-list__link:active {
  transform: scale(0.99);
}
.song-list__icon {
  color: var(--color-primary);
  display: inline-flex;
  padding: var(--space-2);
  background: color-mix(in srgb, var(--color-primary) 10%, transparent);
  border-radius: var(--radius-md);
}
.song-list__info {
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
  min-width: 0;
}
.song-list__title {
  margin: 0;
  font-size: var(--font-size-base);
  font-weight: 600;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.song-list__artist {
  margin: 0;
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
}
.song-list__offline {
  color: var(--color-success);
  display: inline-flex;
}
.song-list__empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-8);
  color: var(--color-text-muted);
  text-align: center;
}
</style>
