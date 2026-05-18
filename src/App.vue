<script setup>
import { RouterView, RouterLink } from 'vue-router';
import { onMounted } from 'vue';
import { useOfflineManager } from './composables/useOfflineManager.js';
import { useInstallPrompt } from './composables/useInstallPrompt.js';
import BaseIcon from './components/atoms/BaseIcon.vue';
import AppNav from './components/molecules/AppNav.vue';

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
      <AppNav class="app-shell__top-nav" />
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

    <nav class="app-shell__bottom" aria-label="Navegación inferior">
      <AppNav />
    </nav>

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
  grid-template-rows: auto 1fr auto;
  grid-template-columns: minmax(0, 1fr);
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
  gap: var(--space-3);
}
.app-shell__brand {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  font-weight: 700;
  color: var(--color-primary);
  font-size: var(--font-size-lg);
}
.app-shell__top-nav {
  display: none;
}
.app-shell__main {
  padding: var(--space-4);
  max-width: var(--content-max-width);
  width: 100%;
  margin-inline: auto;
  padding-bottom: calc(var(--space-4) + 76px);
}
.app-shell__bottom {
  position: sticky;
  bottom: 0;
  border-top: 1px solid var(--color-border);
  background: var(--color-surface);
  z-index: 10;
  padding-bottom: env(safe-area-inset-bottom, 0);
}

@media (min-width: 768px) {
  .app-shell__top-nav {
    display: inline-flex;
  }
  .app-shell__bottom {
    display: none;
  }
  .app-shell__main {
    padding-bottom: var(--space-4);
  }
}

.app-shell__install {
  position: fixed;
  bottom: calc(76px + var(--space-2));
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
  z-index: 50;
}
@media (min-width: 768px) {
  .app-shell__install {
    bottom: var(--space-4);
  }
}
.app-shell__install button {
  background: white;
  color: var(--color-primary);
  padding: var(--space-2) var(--space-3);
  border-radius: var(--radius-md);
  font-weight: 600;
}
</style>
