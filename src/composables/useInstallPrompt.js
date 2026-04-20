import { onMounted, onUnmounted, ref } from 'vue';

/**
 * Composable que captura el evento `beforeinstallprompt` y expone una API simple.
 */
export function useInstallPrompt() {
  const installable = ref(false);
  let deferredEvent = null;

  function onBeforeInstall(e) {
    e.preventDefault();
    deferredEvent = e;
    installable.value = true;
  }

  function onInstalled() {
    installable.value = false;
    deferredEvent = null;
  }

  async function promptInstall() {
    if (!deferredEvent) return null;
    deferredEvent.prompt();
    const choice = await deferredEvent.userChoice;
    deferredEvent = null;
    installable.value = false;
    return choice?.outcome ?? null;
  }

  onMounted(() => {
    window.addEventListener('beforeinstallprompt', onBeforeInstall);
    window.addEventListener('appinstalled', onInstalled);
  });
  onUnmounted(() => {
    window.removeEventListener('beforeinstallprompt', onBeforeInstall);
    window.removeEventListener('appinstalled', onInstalled);
  });

  return { installable, promptInstall };
}
