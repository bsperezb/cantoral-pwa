import { useOfflineStore } from '../stores/offline.store.js';
import { useSongsStore } from '../stores/songs.store.js';
import { fetchSongRaw } from '../services/songLoader.js';

/**
 * Composable que orquesta la descarga/eliminación de cantos para uso offline.
 */
export function useOfflineManager() {
  const offline = useOfflineStore();
  const songs = useSongsStore();

  async function refresh() {
    offline.downloadedIds = await songs.repo.downloadedIds();
    offline.lastSync = new Date().toISOString();
  }

  async function downloadSong(entry) {
    if (offline.downloading.has(entry.id) || offline.downloadedIds.has(entry.id)) return;
    offline.startDownload(entry.id);
    try {
      const raw = await fetchSongRaw(entry.file);
      await songs.repo.save(entry.id, raw, { hash: entry.hash, size: entry.size });
      offline.markDownloaded(entry.id);
    } finally {
      offline.endDownload(entry.id);
    }
  }

  async function removeSong(id) {
    await songs.repo.remove(id);
    offline.unmark(id);
  }

  async function downloadAll() {
    if (songs.manifest.length === 0) await songs.loadManifest();
    const pending = songs.manifest.filter((s) => !offline.downloadedIds.has(s.id));
    offline.setProgress(0, pending.length);
    let done = 0;
    for (const entry of pending) {
      try {
        await downloadSong(entry);
      } catch (err) {
        console.error('[offline] fallo descargando', entry.id, err);
      }
      done++;
      offline.setProgress(done, pending.length);
    }
  }

  async function removeAll() {
    await songs.repo.clear();
    offline.downloadedIds = new Set();
  }

  function initAutoDownloadOnInstall() {
    if (typeof window === 'undefined') return;
    window.addEventListener('appinstalled', () => {
      downloadAll().catch((err) => console.error('[offline] auto-download error', err));
    });
  }

  return {
    refresh,
    downloadSong,
    removeSong,
    downloadAll,
    removeAll,
    initAutoDownloadOnInstall,
  };
}
