<script setup>
import { RouterView, RouterLink } from 'vue-router';
import { onMounted } from 'vue';
import { useOfflineManager } from './composables/useOfflineManager.js';
import { useInstallPrompt } from './composables/useInstallPrompt.js';
import BaseIcon from './components/atoms/BaseIcon.vue';

const { initAutoDownloadOnInstall } = useOfflineManager();
const { installable, promptInstall } = useInstallPrompt();

onMounted(() => {
  initAutoDownloadOnInstall();
});
</script>

<template>
  <div class="app-shell">
    <a href="#main-content" class="skip-link">Saltar al contenido</a>
    <header class="app-shell__header">
      <RouterLink :to="{ name: 'home' }" class="app-shell__brand">
        <BaseIcon name="music" :size="22" />
        <span>Cantoral</span>
      </RouterLink>
      <nav class="app-shell__nav" aria-label="Navegación principal">
        <RouterLink :to="{ name: 'offline-manager' }" aria-label="Offline">
          <BaseIcon name="download" :size="20" />
        </RouterLink>
        <RouterLink :to="{ name: 'settings' }" aria-label="Ajustes">
          <BaseIcon name="settings" :size="20" />
        </RouterLink>
      </nav>
    </header>

    <main id="main-content" class="app-shell__main">
      <RouterView v-slot="{ Component }">
        <Suspense>
          <component :is="Component" />
          <template #fallback>
            <p class="app-shell__loading">Cargando…</p>
          </template>
        </Suspense>
      </RouterView>
    </main>

    <div v-if="installable" class="app-shell__install" role="dialog">
      <p>Instala Cantoral en tu dispositivo para acceso offline completo.</p>
      <button type="button" @click="promptInstall">Instalar</button>
    </div>
  </div>
</template>

<style scoped>
.app-shell {
  min-height: 100dvh;
  display: grid;
  grid-template-rows: auto 1fr;
}
.skip-link {
  position: absolute;
  top: -40px;
  left: var(--space-2);
  padding: var(--space-2) var(--space-3);
  background: var(--color-primary);
  color: var(--color-primary-contrast);
  border-radius: var(--radius-md);
  z-index: 100;
  transition: top var(--transition-fast);
}
.skip-link:focus {
  top: var(--space-2);
}
.app-shell__loading {
  padding: var(--space-6);
  text-align: center;
  color: var(--color-text-muted);
}
.app-shell__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: var(--space-3) var(--space-4);
  background: var(--color-surface);
  border-bottom: 1px solid var(--color-border);
  position: sticky;
  top: 0;
  z-index: 10;
  backdrop-filter: blur(6px);
}
.app-shell__brand {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  font-weight: 700;
  color: var(--color-primary);
  font-size: var(--font-size-lg);
}
.app-shell__nav {
  display: inline-flex;
  gap: var(--space-1);
}
.app-shell__nav a {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: var(--space-2);
  border-radius: var(--radius-md);
  color: var(--color-text-muted);
  min-width: 40px;
  min-height: 40px;
}
.app-shell__nav a:hover,
.app-shell__nav a.router-link-active {
  background: var(--color-surface-2);
  color: var(--color-primary);
}
.app-shell__main {
  padding: var(--space-4);
  max-width: var(--content-max-width);
  width: 100%;
  margin-inline: auto;
}
.app-shell__install {
  position: fixed;
  bottom: var(--space-4);
  left: var(--space-4);
  right: var(--space-4);
  background: var(--color-primary);
  color: var(--color-primary-contrast);
  padding: var(--space-3) var(--space-4);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-lg);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-3);
  max-width: var(--content-max-width);
  margin-inline: auto;
}
.app-shell__install button {
  background: white;
  color: var(--color-primary);
  padding: var(--space-2) var(--space-3);
  border-radius: var(--radius-md);
  font-weight: 600;
}
</style>
