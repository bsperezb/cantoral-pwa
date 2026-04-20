import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useOfflineStore = defineStore('offline', () => {
  const downloadedIds = ref(new Set());
  const downloading = ref(new Set());
  const progress = ref({ done: 0, total: 0 });
  const lastSync = ref(null);

  function markDownloaded(id) {
    downloadedIds.value = new Set([...downloadedIds.value, id]);
  }
  function unmark(id) {
    const next = new Set(downloadedIds.value);
    next.delete(id);
    downloadedIds.value = next;
  }
  function startDownload(id) {
    downloading.value = new Set([...downloading.value, id]);
  }
  function endDownload(id) {
    const next = new Set(downloading.value);
    next.delete(id);
    downloading.value = next;
  }
  function setProgress(done, total) {
    progress.value = { done, total };
  }

  return {
    downloadedIds,
    downloading,
    progress,
    lastSync,
    markDownloaded,
    unmark,
    startDownload,
    endDownload,
    setProgress,
  };
});
