<script setup>
defineProps({
  active: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
});
defineEmits(['click']);
</script>

<template>
  <button
    type="button"
    class="base-chip"
    :class="{ 'base-chip--active': active }"
    :disabled="disabled"
    :aria-pressed="active"
    @click="$emit('click', $event)"
  >
    <slot />
  </button>
</template>

<style scoped>
.base-chip {
  display: inline-flex;
  align-items: center;
  gap: var(--space-1);
  padding: var(--space-1) var(--space-3);
  border-radius: var(--radius-full);
  border: 1px solid var(--color-border);
  background: var(--color-surface);
  color: var(--color-text);
  font-size: var(--font-size-sm);
  font-weight: 500;
  min-height: 32px;
  transition:
    background var(--transition-fast),
    border-color var(--transition-fast),
    color var(--transition-fast);
}
.base-chip--active {
  background: var(--color-primary);
  color: var(--color-primary-contrast);
  border-color: var(--color-primary);
}
.base-chip:disabled {
  opacity: 0.5;
}
</style>
