<script setup>
import { ref, watch } from 'vue';
import BaseIcon from '../atoms/BaseIcon.vue';

const props = defineProps({
  modelValue: { type: String, default: '' },
  placeholder: { type: String, default: 'Buscar canto...' },
  debounce: { type: Number, default: 150 },
});
const emit = defineEmits(['update:modelValue']);

const local = ref(props.modelValue);
let timeout = null;

watch(local, (v) => {
  if (timeout) clearTimeout(timeout);
  timeout = setTimeout(() => emit('update:modelValue', v), props.debounce);
});

watch(
  () => props.modelValue,
  (v) => {
    if (v !== local.value) local.value = v;
  }
);

function clear() {
  local.value = '';
  emit('update:modelValue', '');
}
</script>

<template>
  <div class="search-bar">
    <span class="search-bar__icon" aria-hidden="true">
      <BaseIcon name="search" :size="18" />
    </span>
    <input
      v-model="local"
      type="search"
      :placeholder="placeholder"
      class="search-bar__input"
      autocomplete="off"
      aria-label="Buscar canto"
    />
    <button
      v-if="local"
      type="button"
      class="search-bar__clear"
      aria-label="Limpiar búsqueda"
      @click="clear"
    >
      <BaseIcon name="close" :size="16" />
    </button>
  </div>
</template>

<style scoped>
.search-bar {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding: 0 var(--space-3);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-full);
  min-height: 44px;
  transition:
    border-color var(--transition-fast),
    box-shadow var(--transition-fast);
}
.search-bar:focus-within {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--color-primary) 20%, transparent);
}
.search-bar__icon {
  color: var(--color-text-muted);
  display: inline-flex;
}
.search-bar__input {
  flex: 1;
  border: none;
  outline: none;
  background: transparent;
  font-size: var(--font-size-base);
  color: var(--color-text);
  padding: var(--space-2) 0;
  min-width: 0;
}
.search-bar__input::-webkit-search-cancel-button {
  display: none;
}
.search-bar__clear {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 4px;
  color: var(--color-text-muted);
  border-radius: var(--radius-full);
}
.search-bar__clear:hover {
  background: var(--color-surface-2);
}
</style>
