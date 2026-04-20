<script setup>
defineProps({
  tone: { type: String, default: 'neutral' }, // 'neutral' | 'primary' | 'success' | 'danger'
});
</script>

<template>
  <span class="base-tag" :class="`base-tag--${tone}`"><slot /></span>
</template>

<style scoped>
.base-tag {
  display: inline-flex;
  align-items: center;
  padding: 2px var(--space-2);
  border-radius: var(--radius-sm);
  font-size: var(--font-size-xs);
  font-weight: 500;
  line-height: 1.4;
}
.base-tag--neutral {
  background: var(--color-surface-2);
  color: var(--color-text-muted);
}
.base-tag--primary {
  background: color-mix(in srgb, var(--color-primary) 15%, transparent);
  color: var(--color-primary);
}
.base-tag--success {
  background: color-mix(in srgb, var(--color-success) 15%, transparent);
  color: var(--color-success);
}
.base-tag--danger {
  background: color-mix(in srgb, var(--color-danger) 15%, transparent);
  color: var(--color-danger);
}
</style>
