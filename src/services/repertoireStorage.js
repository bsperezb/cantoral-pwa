/**
 * Persistencia inteligente para Repertorios.
 * - PWA instalada → IndexedDB (durable entre sesiones).
 * - Navegador web → sessionStorage (vive durante la sesión actual).
 *
 * El modo se detecta una vez al cargar la app.
 */
import { useIndexedDB, STORES } from '../composables/useIndexedDB.js';
import { usePwaMode } from '../composables/usePwaMode.js';

const SESSION_KEY = 'cantoral.repertoires';
const db = useIndexedDB();
const { isStandalone } = usePwaMode();

function readSession() {
  if (typeof sessionStorage === 'undefined') return [];
  try {
    const raw = sessionStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeSession(list) {
  if (typeof sessionStorage === 'undefined') return;
  sessionStorage.setItem(SESSION_KEY, JSON.stringify(list));
}

export function getStorageMode() {
  return isStandalone() ? 'persistent' : 'session';
}

export async function loadAll() {
  if (isStandalone()) {
    const items = await db.getAll(STORES.repertoires);
    return items ?? [];
  }
  return readSession();
}

export async function saveOne(repertoire) {
  if (isStandalone()) {
    await db.put(STORES.repertoires, repertoire);
    return;
  }
  const list = readSession();
  const idx = list.findIndex((r) => r.id === repertoire.id);
  if (idx >= 0) list[idx] = repertoire;
  else list.push(repertoire);
  writeSession(list);
}

export async function deleteOne(id) {
  if (isStandalone()) {
    await db.delete(STORES.repertoires, id);
    return;
  }
  const list = readSession().filter((r) => r.id !== id);
  writeSession(list);
}
