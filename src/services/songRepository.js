import { useIndexedDB, STORES } from '../composables/useIndexedDB.js';
import { parseSong } from './parsers/index.js';

/**
 * Repository Pattern: única interfaz para leer/escribir cantos.
 * Gestiona tanto el raw como el parsed (cacheado para evitar re-parseo).
 */
export function createSongRepository() {
  const db = useIndexedDB();

  return {
    async save(id, rawText, extraMeta = {}) {
      const parsed = parseSong(rawText, { fallbackId: id });
      const record = {
        id,
        raw: rawText,
        parsed,
        hash: extraMeta.hash ?? null,
        size: extraMeta.size ?? rawText.length,
        downloadedAt: new Date().toISOString(),
      };
      await db.put(STORES.songs, record);
      await db.put(STORES.offlineMeta, {
        id,
        downloadedAt: record.downloadedAt,
        size: record.size,
      });
      return record;
    },

    async get(id) {
      return db.get(STORES.songs, id);
    },

    async getParsed(id) {
      const record = await db.get(STORES.songs, id);
      return record?.parsed ?? null;
    },

    async list() {
      return db.getAll(STORES.songs);
    },

    async downloadedIds() {
      const metas = await db.getAll(STORES.offlineMeta);
      return new Set(metas.map((m) => m.id));
    },

    async remove(id) {
      await db.delete(STORES.songs, id);
      await db.delete(STORES.offlineMeta, id);
    },

    async clear() {
      await db.clear(STORES.songs);
      await db.clear(STORES.offlineMeta);
    },
  };
}
