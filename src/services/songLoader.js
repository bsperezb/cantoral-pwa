// Los paths del manifest son absolutos tipo "/songs/foo.song".
// En GH Pages la app vive bajo un sub-path — resolvemos contra import.meta.env.BASE_URL.
const BASE = import.meta.env.BASE_URL || '/';

function resolve(path) {
  if (/^https?:/.test(path)) return path;
  const clean = path.startsWith('/') ? path.slice(1) : path;
  return `${BASE.endsWith('/') ? BASE : `${BASE}/`}${clean}`;
}

export async function fetchManifest() {
  const res = await fetch(resolve('/songs/index.json'), { cache: 'no-cache' });
  if (!res.ok) throw new Error(`No se pudo cargar manifest (${res.status})`);
  return res.json();
}

export async function fetchSongRaw(fileUrl) {
  const res = await fetch(resolve(fileUrl));
  if (!res.ok) throw new Error(`No se pudo cargar canto ${fileUrl} (${res.status})`);
  return res.text();
}
