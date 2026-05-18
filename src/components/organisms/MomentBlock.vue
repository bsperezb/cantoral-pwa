<script setup>
import { computed, ref } from 'vue';
import BaseIcon from '../atoms/BaseIcon.vue';
import MomentSongRow from '../molecules/MomentSongRow.vue';

const props = defineProps({
  moment: { type: Object, required: true },
  songsById: { type: Object, required: true }, // Map<id, songMeta>
  canMoveUp: { type: Boolean, default: false },
  canMoveDown: { type: Boolean, default: false },
});
const emit = defineEmits([
  'rename',
  'remove',
  'move-up',
  'move-down',
  'add-song',
  'move-song',
  'remove-song',
]);

const editing = ref(false);
const draft = ref(props.moment.title);

function startEdit() {
  draft.value = props.moment.title;
  editing.value = true;
}
function commit() {
  const clean = draft.value.trim();
  if (clean && clean !== props.moment.title) emit('rename', clean);
  editing.value = false;
}
function cancel() {
  editing.value = false;
}

const songsCount = computed(() => props.moment.songIds.length);
</script>

<template>
  <article class="moment">
    <header class="moment__head">
      <div class="moment__reorder">
        <button
          type="button"
          class="moment__icon-btn"
          :disabled="!canMoveUp"
          aria-label="Mover momento arriba"
          @click="$emit('move-up')"
        >
          <BaseIcon name="arrow-up" :size="14" />
        </button>
        <button
          type="button"
          class="moment__icon-btn"
          :disabled="!canMoveDown"
          aria-label="Mover momento abajo"
          @click="$emit('move-down')"
        >
          <BaseIcon name="arrow-down" :size="14" />
        </button>
      </div>

      <div class="moment__title-wrap">
        <input
          v-if="editing"
          v-model="draft"
          class="moment__title-input"
          type="text"
          aria-label="Nombre del momento"
          @blur="commit"
          @keydown.enter.prevent="commit"
          @keydown.escape.prevent="cancel"
        />
        <button
          v-else
          type="button"
          class="moment__title-btn"
          @click="startEdit"
        >
          <span>{{ moment.title }}</span>
          <BaseIcon name="pencil" :size="13" />
        </button>
      </div>

      <span class="moment__count" :aria-label="`${songsCount} cantos`">{{ songsCount }}</span>

      <button
        type="button"
        class="moment__icon-btn moment__icon-btn--danger"
        aria-label="Eliminar momento"
        @click="$emit('remove')"
      >
        <BaseIcon name="trash" :size="16" />
      </button>
    </header>

    <ul v-if="moment.songIds.length" class="moment__songs">
      <li v-for="(songId, i) in moment.songIds" :key="songId">
        <MomentSongRow
          :index="i"
          :song-id="songId"
          :song="songsById.get(songId)"
          :can-move-up="i > 0"
          :can-move-down="i < moment.songIds.length - 1"
          @move-up="$emit('move-song', songId, -1)"
          @move-down="$emit('move-song', songId, 1)"
          @remove="$emit('remove-song', songId)"
        />
      </li>
    </ul>
    <p v-else class="moment__empty">Sin cantos. Añade el primero.</p>

    <button type="button" class="moment__add" @click="$emit('add-song')">
      <BaseIcon name="plus" :size="14" />
      Añadir canto
    </button>
  </article>
</template>

<style scoped>
.moment {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  padding: var(--space-3);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
}
.moment__head {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}
.moment__reorder {
  display: inline-flex;
  flex-direction: column;
  gap: 1px;
}
.moment__icon-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 24px;
  border-radius: var(--radius-sm);
  background: transparent;
  color: var(--color-text-muted);
}
.moment__icon-btn:hover:not(:disabled) {
  background: var(--color-surface-2);
  color: var(--color-text);
}
.moment__icon-btn:disabled {
  opacity: 0.3;
  cursor: not-allowed;
}
.moment__icon-btn--danger {
  width: 36px;
  height: 36px;
}
.moment__icon-btn--danger:hover {
  background: color-mix(in srgb, var(--color-danger) 12%, transparent);
  color: var(--color-danger);
}
.moment__title-wrap {
  flex: 1;
  min-width: 0;
}
.moment__title-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: transparent;
  color: var(--color-text);
  font-weight: 700;
  font-size: var(--font-size-base);
  padding: 4px 6px;
  border-radius: var(--radius-sm);
  max-width: 100%;
}
.moment__title-btn:hover {
  background: var(--color-surface-2);
}
.moment__title-btn span {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.moment__title-input {
  width: 100%;
  font: inherit;
  font-weight: 700;
  font-size: var(--font-size-base);
  padding: 4px 6px;
  border-radius: var(--radius-sm);
  border: 1px solid var(--color-primary);
  background: var(--color-bg);
  color: var(--color-text);
}
.moment__count {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 24px;
  height: 22px;
  padding: 0 8px;
  border-radius: var(--radius-full);
  font-size: var(--font-size-xs);
  font-weight: 700;
  background: color-mix(in srgb, var(--color-primary) 14%, transparent);
  color: var(--color-primary);
}
.moment__songs {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}
.moment__empty {
  margin: 0;
  padding: var(--space-2);
  text-align: center;
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
}
.moment__add {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: var(--space-2) var(--space-3);
  min-height: 40px;
  border-radius: var(--radius-md);
  border: 1px dashed var(--color-border);
  background: transparent;
  color: var(--color-primary);
  font-weight: 600;
  font-size: var(--font-size-sm);
}
.moment__add:hover {
  background: color-mix(in srgb, var(--color-primary) 8%, transparent);
  border-color: var(--color-primary);
}
</style>
