<script setup>
defineProps({
  variant: { type: String, default: 'primary' }, // 'primary' | 'secondary' | 'ghost' | 'danger'
  size: { type: String, default: 'md' }, // 'sm' | 'md' | 'lg'
  type: { type: String, default: 'button' },
  disabled: { type: Boolean, default: false },
  iconOnly: { type: Boolean, default: false },
  ariaLabel: { type: String, default: undefined },
});
defineEmits(['click']);
</script>

<template>
  <button
    :type="type"
    :disabled="disabled"
    :aria-label="ariaLabel"
    :class="[
      'base-button',
      `base-button--${variant}`,
      `base-button--${size}`,
      { 'base-button--icon-only': iconOnly },
    ]"
    @click="$emit('click', $event)"
  >
    <slot />
  </button>
</template>

<style scoped>
.base-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-4);
  border-radius: var(--radius-md);
  font-weight: 500;
  font-size: var(--font-size-base);
  line-height: 1;
  min-height: 44px; /* accesibilidad táctil */
  transition:
    background var(--transition-fast),
    transform var(--transition-fast),
    box-shadow var(--transition-fast);
  cursor: pointer;
  user-select: none;
}

.base-button:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.base-button--sm {
  padding: var(--space-1) var(--space-3);
  font-size: var(--font-size-sm);
  min-height: 36px;
}

.base-button--lg {
  padding: var(--space-3) var(--space-5);
  font-size: var(--font-size-lg);
  min-height: 52px;
}

.base-button--icon-only {
  padding: var(--space-2);
  aspect-ratio: 1 / 1;
}

.base-button--primary {
  background: var(--color-primary);
  color: var(--color-primary-contrast);
}
.base-button--primary:hover:not(:disabled) {
  background: var(--color-primary-hover);
}
.base-button--primary:active:not(:disabled) {
  transform: scale(0.97);
}

.base-button--secondary {
  background: var(--color-surface-2);
  color: var(--color-text);
  border: 1px solid var(--color-border);
}
.base-button--secondary:hover:not(:disabled) {
  background: var(--color-border);
}

.base-button--ghost {
  background: transparent;
  color: var(--color-text);
}
.base-button--ghost:hover:not(:disabled) {
  background: var(--color-surface-2);
}

.base-button--danger {
  background: var(--color-danger);
  color: white;
}
</style>
