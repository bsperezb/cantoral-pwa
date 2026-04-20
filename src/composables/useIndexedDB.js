import { openDB } from 'idb';

const DB_NAME = 'cantoral-db';
const DB_VERSION = 1;

export const STORES = {
  songs: 'songs', // key: id, value: { id, raw, parsed, hash, downloadedAt }
  categories: 'categories', // key: id, value: { id, name, subcategories }
  preferences: 'preferences', // key: name, value
  offlineMeta: 'offlineMeta', // key: id, value: { id, downloadedAt, size }
};

let dbPromise = null;

function initDB() {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains(STORES.songs)) {
          db.createObjectStore(STORES.songs, { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains(STORES.categories)) {
          db.createObjectStore(STORES.categories, { keyPath: 'id' });
        }
        if (!db.objectStoreNames.contains(STORES.preferences)) {
          db.createObjectStore(STORES.preferences);
        }
        if (!db.objectStoreNames.contains(STORES.offlineMeta)) {
          db.createObjectStore(STORES.offlineMeta, { keyPath: 'id' });
        }
      },
    });
  }
  return dbPromise;
}

export function useIndexedDB() {
  return {
    async get(store, key) {
      const db = await initDB();
      return db.get(store, key);
    },
    async getAll(store) {
      const db = await initDB();
      return db.getAll(store);
    },
    async put(store, value, key) {
      const db = await initDB();
      return db.put(store, value, key);
    },
    async delete(store, key) {
      const db = await initDB();
      return db.delete(store, key);
    },
    async clear(store) {
      const db = await initDB();
      return db.clear(store);
    },
    async keys(store) {
      const db = await initDB();
      return db.getAllKeys(store);
    },
  };
}
