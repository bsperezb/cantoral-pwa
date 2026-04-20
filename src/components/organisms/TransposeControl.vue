<script setup>
import BaseButton from '../atoms/BaseButton.vue';
import BaseIcon from '../atoms/BaseIcon.vue';

defineProps({
  semitones: { type: Number, default: 0 },
  notation: { type: String, default: 'english' },
});
defineEmits(['up', 'down', 'reset', 'toggle-notation']);
</script>

<template>
  <div class="transpose-control" role="group" aria-label="Controles de transposición">
    <BaseButton
      variant="secondary"
      size="sm"
      icon-only
      aria-label="Bajar medio tono"
      @click="$emit('down')"
    >
      <BaseIcon name="minus" :size="18" />
    </BaseButton>
    <button
      type="button"
      class="transpose-control__value"
      :aria-label="`Transposición actual: ${semitones} semitonos. Restablecer`"
      @click="$emit('reset')"
    >
      {{ semitones > 0 ? '+' : '' }}{{ semitones }}
    </button>
    <BaseButton
      variant="secondary"
      size="sm"
      icon-only
      aria-label="Subir medio tono"
      @click="$emit('up')"
    >
      <BaseIcon name="plus" :size="18" />
    </BaseButton>
    <BaseButton
      variant="ghost"
      size="sm"
      aria-label="Cambiar notación"
      @click="$emit('toggle-notation')"
    >
      {{ notation === 'english' ? 'C D E' : 'Do Re Mi' }}
    </BaseButton>
  </div>
</template>

<style scoped>
.transpose-control {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-2);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-full);
  box-shadow: var(--shadow-sm);
}
.transpose-control__value {
  font-variant-numeric: tabular-nums;
  font-weight: 700;
  color: var(--color-primary);
  min-width: 2.5rem;
  text-align: center;
  padding: var(--space-1) var(--space-2);
  border-radius: var(--radius-md);
  font-size: var(--font-size-base);
}
.transpose-control__value:hover {
  background: var(--color-surface-2);
}
</style>
