/**
 * @param {string} text
 * @returns {'native'|'lacuerda'}
 */
export function detectFormat(text) {
  const trimmed = text.trimStart();
  if (trimmed.startsWith('---')) return 'native';
  if (trimmed.startsWith('====')) return 'lacuerda';
  if (trimmed.includes('lacuerda.net') || /^\|\s*ARTISTA:/m.test(text)) return 'lacuerda';
  // Fallback: laCuerda heurístico (sin header).
  return 'lacuerda';
}
