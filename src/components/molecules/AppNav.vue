<script setup>
import { RouterLink } from 'vue-router';
import BaseIcon from '../atoms/BaseIcon.vue';

const ITEMS = [
  { name: 'home', label: 'Inicio', icon: 'home', match: ['home', 'song-detail', 'categories'] },
  { name: 'repertoires', label: 'Repertorios', icon: 'list-music', match: ['repertoires', 'repertoire-edit', 'repertoire-present'] },
  { name: 'offline-manager', label: 'Descargas', icon: 'download', match: ['offline-manager'] },
  { name: 'settings', label: 'Ajustes', icon: 'settings', match: ['settings'] },
];
</script>

<template>
  <nav class="app-nav" aria-label="Navegación principal">
    <RouterLink
      v-for="item in ITEMS"
      :key="item.name"
      :to="{ name: item.name }"
      :class="['app-nav__item', { 'app-nav__item--active': $route.matched.some(r => item.match.includes(r.name)) }]"
      :aria-label="item.label"
    >
      <BaseIcon :name="item.icon" :size="22" />
      <span class="app-nav__label">{{ item.label }}</span>
    </RouterLink>
  </nav>
</template>

<style scoped>
.app-nav {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 4px;
  padding: 6px 8px;
  background: var(--color-surface);
}
.app-nav__item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  padding: 6px 4px;
  border-radius: var(--radius-md);
  color: var(--color-text-muted);
  min-height: 56px;
  font-size: 11px;
  font-weight: 500;
  text-decoration: none;
  transition:
    background var(--transition-fast),
    color var(--transition-fast);
}
.app-nav__item:hover {
  background: var(--color-surface-2);
  color: var(--color-text);
}
.app-nav__item--active {
  color: var(--color-primary);
  font-weight: 600;
}
.app-nav__item--active:hover {
  background: color-mix(in srgb, var(--color-primary) 12%, transparent);
}
.app-nav__label {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 100%;
}

/* Desktop: switch to horizontal row layout */
@media (min-width: 768px) {
  .app-nav {
    display: inline-flex;
    grid-template-columns: none;
    gap: 4px;
    padding: 0;
    background: transparent;
  }
  .app-nav__item {
    flex-direction: row;
    gap: 8px;
    padding: 8px 14px;
    min-height: 44px;
    font-size: var(--font-size-sm);
  }
}
</style>
