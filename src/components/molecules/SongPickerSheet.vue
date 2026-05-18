<script setup>
import { computed, ref, watch, nextTick } from 'vue';
import BaseIcon from '../atoms/BaseIcon.vue';

const props = defineProps({
  open: { type: Boolean, default: false },
  songs: { type: Array, default: () => [] }, // [{ id, title, artist }]
  excludedIds: { type: Array, default: () => [] },
  title: { type: String, default: 'Añadir canto' },
});
const emit = defineEmits(['close', 'select']);

const query = ref('');
const inputRef = ref(null);

const excluded = computed(() => new Set(props.excludedIds));
const filtered = computed(() => {
  const q = query.value.trim().toLowerCase();
  return props.songs
    .filter((s) => !excluded.value.has(s.id))
    .filter((s) => {
      if (!q) return true;
      return (
        s.title?.toLowerCase().includes(q) ||
        s.artist?.toLowerCase().includes(q)
      );
    });
});

watch(
  () => props.open,
  (v) => {
    if (v) {
      query.value = '';
      nextTick(() => inputRef.value?.focus());
    }
  }
);

function pick(songId) {
  emit('select', songId);
}
</script>

<template>
  <Teleport to="body">
    <Transition name="sheet">
      <div v-if="open" class="picker" role="dialog" aria-modal="true" @click.self="emit('close')">
        <div class="picker__sheet">
          <header class="picker__head">
            <h2 class="picker__title">{{ title }}</h2>
            <button
              type="button"
              class="picker__close"
              aria-label="Cerrar"
              @click="emit('close')"
            >
              <BaseIcon name="close" :size="20" />
            </button>
          </header>
          <div class="picker__search">
            <BaseIcon name="search" :size="16" />
            <input
              ref="inputRef"
              v-model="query"
              type="search"
              placeholder="Buscar canto…"
              class="picker__input"
            />
          </div>
          <ul v-if="filtered.length" class="picker__list">
            <li v-for="song in filtered" :key="song.id">
              <button type="button" class="picker__item" @click="pick(song.id)">
                <div class="picker__item-info">
                  <p class="picker__item-title">{{ song.title }}</p>
                  <p v-if="song.artist" class="picker__item-artist">{{ song.artist }}</p>
                </div>
                <BaseIcon name="plus" :size="18" />
              </button>
            </li>
          </ul>
          <p v-else class="picker__empty">No hay cantos para añadir.</p>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.picker {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  display: flex;
  align-items: flex-end;
  justify-content: center;
}
.picker__sheet {
  background: var(--color-surface);
  width: 100%;
  max-width: var(--content-max-width, 640px);
  max-height: 85dvh;
  border-radius: var(--radius-lg) var(--radius-lg) 0 0;
  display: flex;
  flex-direction: column;
  padding: var(--space-3) var(--space-4) var(--space-5);
  gap: var(--space-3);
}
.picker__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-2);
}
.picker__title {
  margin: 0;
  font-size: var(--font-size-lg);
  font-weight: 700;
  color: var(--color-text);
}
.picker__close {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 44px;
  min-height: 44px;
  border-radius: var(--radius-md);
  color: var(--color-text-muted);
  background: transparent;
}
.picker__close:hover {
  background: var(--color-surface-2);
}
.picker__search {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-3);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  color: var(--color-text-muted);
  background: var(--color-bg);
}
.picker__input {
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  font: inherit;
  color: var(--color-text);
  min-height: 32px;
}
.picker__list {
  list-style: none;
  margin: 0;
  padding: 0;
  overflow-y: auto;
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.picker__item {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-3);
  border-radius: var(--radius-md);
  background: transparent;
  color: var(--color-text);
  min-height: 56px;
}
.picker__item:hover {
  background: var(--color-surface-2);
}
.picker__item-info {
  text-align: left;
  min-width: 0;
}
.picker__item-title {
  margin: 0;
  font-weight: 600;
  font-size: var(--font-size-base);
}
.picker__item-artist {
  margin: 2px 0 0;
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
}
.picker__empty {
  padding: var(--space-5);
  text-align: center;
  color: var(--color-text-muted);
}
.sheet-enter-active,
.sheet-leave-active {
  transition: opacity var(--transition-fast);
}
.sheet-enter-active .picker__sheet,
.sheet-leave-active .picker__sheet {
  transition: transform var(--transition-normal, 250ms) ease-out;
}
.sheet-enter-from,
.sheet-leave-to {
  opacity: 0;
}
.sheet-enter-from .picker__sheet,
.sheet-leave-to .picker__sheet {
  transform: translateY(100%);
}
</style>
