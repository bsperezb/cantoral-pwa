<script setup>
defineProps({
  modelValue: { type: Boolean, default: false },
  label: { type: String, default: '' },
  disabled: { type: Boolean, default: false },
});
defineEmits(['update:modelValue']);
</script>

<template>
  <label class="base-toggle" :class="{ 'is-disabled': disabled }">
    <input
      type="checkbox"
      :checked="modelValue"
      :disabled="disabled"
      class="base-toggle__input"
      @change="$emit('update:modelValue', $event.target.checked)"
    />
    <span class="base-toggle__track" aria-hidden="true">
      <span class="base-toggle__thumb" />
    </span>
    <span v-if="label" class="base-toggle__label">{{ label }}</span>
  </label>
</template>

<style scoped>
.base-toggle {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  cursor: pointer;
  user-select: none;
}
.base-toggle.is-disabled {
  opacity: 0.5;
  cursor: not-allowed;
}
.base-toggle__input {
  position: absolute;
  opacity: 0;
  pointer-events: none;
}
.base-toggle__track {
  width: 40px;
  height: 24px;
  border-radius: var(--radius-full);
  background: var(--color-border);
  position: relative;
  transition: background var(--transition-base);
}
.base-toggle__thumb {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: white;
  box-shadow: var(--shadow-sm);
  transition: transform var(--transition-base);
}
.base-toggle__input:checked + .base-toggle__track {
  background: var(--color-primary);
}
.base-toggle__input:checked + .base-toggle__track .base-toggle__thumb {
  transform: translateX(16px);
}
.base-toggle__input:focus-visible + .base-toggle__track {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}
</style>
