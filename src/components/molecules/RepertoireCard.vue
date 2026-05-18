<script setup>
import { computed } from 'vue';
import BaseIcon from '../atoms/BaseIcon.vue';
import { TEMPLATES } from '../../services/repertoireTemplates.js';

const props = defineProps({
  repertoire: { type: Object, required: true },
});
defineEmits(['open', 'edit', 'remove', 'present']);

const totalSongs = computed(() =>
  props.repertoire.moments.reduce((sum, m) => sum + m.songIds.length, 0)
);
const template = computed(() => TEMPLATES[props.repertoire.templateType] ?? TEMPLATES.blank);

const dateLabel = computed(() => {
  const diff = Date.now() - props.repertoire.updatedAt;
  const day = 86_400_000;
  if (diff < 60_000) return 'Actualizado ahora';
  if (diff < 3_600_000) return `Hace ${Math.floor(diff / 60_000)} min`;
  if (diff < day) return `Hace ${Math.floor(diff / 3_600_000)} h`;
  if (diff < 7 * day) return `Hace ${Math.floor(diff / day)} d`;
  return new Date(props.repertoire.updatedAt).toLocaleDateString();
});
</script>

<template>
  <article class="rep-card">
    <header class="rep-card__head">
      <div class="rep-card__info">
        <h3 class="rep-card__title">{{ repertoire.name }}</h3>
        <p class="rep-card__sub">{{ dateLabel }}</p>
      </div>
      <div class="rep-card__menu">
        <button
          type="button"
          class="rep-card__icon-btn"
          aria-label="Eliminar repertorio"
          @click="$emit('remove')"
        >
          <BaseIcon name="trash" :size="18" />
        </button>
      </div>
    </header>

    <div class="rep-card__stats">
      <span class="rep-card__stat">
        <BaseIcon name="layers" :size="14" />
        {{ repertoire.moments.length }} momentos
      </span>
      <span class="rep-card__stat">
        <BaseIcon name="music" :size="14" />
        {{ totalSongs }} cantos
      </span>
    </div>

    <div class="rep-card__row">
      <span :class="['rep-card__tag', `rep-card__tag--${template.id}`]">
        <BaseIcon :name="template.icon" :size="12" />
        {{ template.name }}
      </span>
      <div class="rep-card__actions">
        <button
          type="button"
          class="rep-card__btn rep-card__btn--ghost"
          @click="$emit('edit')"
        >
          <BaseIcon name="pencil" :size="14" />
          Editar
        </button>
        <button
          type="button"
          class="rep-card__btn rep-card__btn--primary"
          @click="$emit('present')"
        >
          <BaseIcon name="play" :size="14" />
          Presentar
        </button>
      </div>
    </div>
  </article>
</template>

<style scoped>
.rep-card {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  padding: var(--space-4);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
}
.rep-card__head {
  display: flex;
  gap: var(--space-2);
  align-items: flex-start;
}
.rep-card__info {
  flex: 1;
  min-width: 0;
}
.rep-card__title {
  margin: 0;
  font-size: var(--font-size-lg);
  font-weight: 700;
  color: var(--color-text);
  overflow-wrap: break-word;
}
.rep-card__sub {
  margin: 2px 0 0;
  font-size: var(--font-size-xs);
  color: var(--color-text-muted);
}
.rep-card__icon-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 44px;
  min-height: 44px;
  border-radius: var(--radius-md);
  color: var(--color-text-muted);
  background: transparent;
}
.rep-card__icon-btn:hover {
  background: var(--color-surface-2);
  color: var(--color-danger);
}
.rep-card__stats {
  display: flex;
  gap: var(--space-4);
  color: var(--color-text-muted);
  font-size: var(--font-size-sm);
}
.rep-card__stat {
  display: inline-flex;
  align-items: center;
  gap: 4px;
}
.rep-card__row {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
  align-items: center;
  justify-content: space-between;
}
.rep-card__tag {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: var(--space-1) var(--space-2);
  border-radius: var(--radius-full);
  font-size: var(--font-size-xs);
  font-weight: 600;
  background: color-mix(in srgb, var(--color-primary) 14%, transparent);
  color: var(--color-primary);
}
.rep-card__tag--blank {
  background: var(--color-surface-2);
  color: var(--color-text-muted);
}
.rep-card__actions {
  display: inline-flex;
  gap: var(--space-1);
}
.rep-card__btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: var(--space-2) var(--space-3);
  border-radius: var(--radius-md);
  font-size: var(--font-size-sm);
  font-weight: 600;
  min-height: 40px;
  transition: background var(--transition-fast);
}
.rep-card__btn--ghost {
  background: transparent;
  color: var(--color-text);
}
.rep-card__btn--ghost:hover {
  background: var(--color-surface-2);
}
.rep-card__btn--primary {
  background: var(--color-primary);
  color: var(--color-primary-contrast);
}
.rep-card__btn--primary:hover {
  background: var(--color-primary-hover);
}
</style>
