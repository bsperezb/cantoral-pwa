<script setup>
import BaseIcon from '../atoms/BaseIcon.vue';

defineProps({
  index: { type: Number, required: true },
  song: { type: Object, default: null }, // { id, title, artist }
  songId: { type: String, required: true },
  canMoveUp: { type: Boolean, default: false },
  canMoveDown: { type: Boolean, default: false },
});
defineEmits(['move-up', 'move-down', 'remove']);
</script>

<template>
  <div class="msong">
    <span class="msong__idx">{{ index + 1 }}</span>
    <div class="msong__info">
      <p class="msong__title">{{ song?.title ?? songId }}</p>
      <p v-if="song?.artist" class="msong__artist">{{ song.artist }}</p>
    </div>
    <div class="msong__actions">
      <button
        type="button"
        class="msong__btn"
        :disabled="!canMoveUp"
        aria-label="Mover arriba"
        @click="$emit('move-up')"
      >
        <BaseIcon name="arrow-up" :size="16" />
      </button>
      <button
        type="button"
        class="msong__btn"
        :disabled="!canMoveDown"
        aria-label="Mover abajo"
        @click="$emit('move-down')"
      >
        <BaseIcon name="arrow-down" :size="16" />
      </button>
      <button
        type="button"
        class="msong__btn msong__btn--remove"
        aria-label="Quitar canto"
        @click="$emit('remove')"
      >
        <BaseIcon name="close" :size="16" />
      </button>
    </div>
  </div>
</template>

<style scoped>
.msong {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-2);
  background: var(--color-surface-2);
  border-radius: var(--radius-md);
}
.msong__idx {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 24px;
  height: 24px;
  border-radius: var(--radius-full);
  background: var(--color-primary);
  color: var(--color-primary-contrast);
  font-size: var(--font-size-xs);
  font-weight: 700;
  padding: 0 6px;
}
.msong__info {
  flex: 1;
  min-width: 0;
}
.msong__title {
  margin: 0;
  font-size: var(--font-size-sm);
  font-weight: 600;
  color: var(--color-text);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.msong__artist {
  margin: 0;
  font-size: var(--font-size-xs);
  color: var(--color-text-muted);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.msong__actions {
  display: inline-flex;
  gap: 2px;
}
.msong__btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: var(--radius-md);
  color: var(--color-text-muted);
  background: transparent;
}
.msong__btn:hover:not(:disabled) {
  background: var(--color-border);
  color: var(--color-text);
}
.msong__btn:disabled {
  opacity: 0.35;
  cursor: not-allowed;
}
.msong__btn--remove:hover {
  color: var(--color-danger);
}
</style>
