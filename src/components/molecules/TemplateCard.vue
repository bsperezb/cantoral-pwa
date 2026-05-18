<script setup>
import BaseIcon from '../atoms/BaseIcon.vue';

defineProps({
  template: { type: Object, required: true },
  selected: { type: Boolean, default: false },
});
defineEmits(['select']);
</script>

<template>
  <button
    type="button"
    :class="['tpl-card', { 'tpl-card--selected': selected }]"
    :aria-pressed="selected"
    @click="$emit('select', template.id)"
  >
    <span class="tpl-card__icon">
      <BaseIcon :name="template.icon" :size="20" />
    </span>
    <span class="tpl-card__title">{{ template.name }}</span>
    <span class="tpl-card__desc">{{ template.description }}</span>
  </button>
</template>

<style scoped>
.tpl-card {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--space-1);
  padding: var(--space-3);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  text-align: left;
  width: 100%;
  min-height: 110px;
  transition:
    border-color var(--transition-fast),
    background var(--transition-fast);
}
.tpl-card:hover {
  background: var(--color-surface-2);
}
.tpl-card--selected {
  border-color: var(--color-primary);
  border-width: 2px;
  padding: calc(var(--space-3) - 1px);
}
.tpl-card__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: var(--radius-md);
  background: color-mix(in srgb, var(--color-primary) 14%, transparent);
  color: var(--color-primary);
  margin-bottom: var(--space-1);
}
.tpl-card--selected .tpl-card__icon {
  background: var(--color-primary);
  color: var(--color-primary-contrast);
}
.tpl-card__title {
  font-size: var(--font-size-base);
  font-weight: 700;
  color: var(--color-text);
}
.tpl-card__desc {
  font-size: var(--font-size-xs);
  color: var(--color-text-muted);
  line-height: 1.3;
}
</style>
