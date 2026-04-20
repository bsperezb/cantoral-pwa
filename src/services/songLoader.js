const MANIFEST_URL = '/songs/index.json';

/**
 * Descarga el manifest remoto de cantos.
 */
export async function fetchManifest(baseUrl = '') {
  const res = await fetch(`${baseUrl}${MANIFEST_URL}`, { cache: 'no-cache' });
  if (!res.ok) throw new Error(`No se pudo cargar manifest (${res.status})`);
  return res.json();
}

/**
 * Descarga el contenido crudo de un canto.
 */
export async function fetchSongRaw(fileUrl, baseUrl = '') {
  const res = await fetch(`${baseUrl}${fileUrl}`);
  if (!res.ok) throw new Error(`No se pudo cargar canto ${fileUrl} (${res.status})`);
  return res.text();
}
