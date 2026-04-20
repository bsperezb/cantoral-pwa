<script setup>
defineProps({
  modelValue: { type: [String, Number], default: '' },
  type: { type: String, default: 'text' },
  placeholder: { type: String, default: '' },
  label: { type: String, default: '' },
  id: { type: String, default: undefined },
  autocomplete: { type: String, default: 'off' },
});
defineEmits(['update:modelValue']);
</script>

<template>
  <label class="base-input">
    <span v-if="label" class="base-input__label">{{ label }}</span>
    <input
      :id="id"
      :type="type"
      :value="modelValue"
      :placeholder="placeholder"
      :autocomplete="autocomplete"
      class="base-input__field"
      @input="$emit('update:modelValue', $event.target.value)"
    />
  </label>
</template>

<style scoped>
.base-input {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
  width: 100%;
}
.base-input__label {
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
  font-weight: 500;
}
.base-input__field {
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background: var(--color-surface);
  padding: var(--space-3) var(--space-4);
  font-size: var(--font-size-base);
  color: var(--color-text);
  min-height: 44px;
  transition:
    border-color var(--transition-fast),
    box-shadow var(--transition-fast);
}
.base-input__field:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--color-primary) 20%, transparent);
}
</style>
