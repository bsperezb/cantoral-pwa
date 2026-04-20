<script setup>
import { onMounted } from 'vue';
import { usePreferencesStore } from '../stores/preferences.store.js';
import BaseToggle from '../components/atoms/BaseToggle.vue';
import { computed } from 'vue';

const prefs = usePreferencesStore();
onMounted(() => {
  if (!prefs.loaded) prefs.load();
});

const isLatin = computed({
  get: () => prefs.notation === 'latin',
  set: (v) => (prefs.notation = v ? 'latin' : 'english'),
});
</script>

<template>
  <section class="settings">
    <h2>Ajustes</h2>
    <div class="settings__item">
      <div>
        <p class="settings__label">Notación latina (Do, Re, Mi)</p>
        <small>Si está apagada se usa notación inglesa (C, D, E).</small>
      </div>
      <BaseToggle v-model="isLatin" aria-label="Alternar notación latina" />
    </div>
  </section>
</template>

<style scoped>
.settings {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}
.settings__item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: var(--space-4);
  padding: var(--space-4);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
}
.settings__label {
  margin: 0;
  font-weight: 500;
}
</style>
