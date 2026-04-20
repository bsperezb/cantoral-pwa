import { isChordLine, extractChordsWithPositions } from '../chordEngine/ChordDetector.js';

export function slugify(text) {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function titleCase(text) {
  return text
    .toLowerCase()
    .split(/\s+/)
    .map((w) => (w.length > 0 ? w[0].toUpperCase() + w.slice(1) : w))
    .join(' ')
    .trim();
}

/**
 * Agrupa líneas del cuerpo en bloques acorde+letra o sólo letra.
 * Devuelve un array de líneas estructuradas: { type: 'chord-lyric'|'lyric'|'chord', chords?, text? }.
 * @param {string[]} bodyLines
 */
export function groupChordLyricLines(bodyLines) {
  const out = [];
  for (let i = 0; i < bodyLines.length; i++) {
    const line = bodyLines[i];
    if (line.trim() === '') {
      out.push({ type: 'empty' });
      continue;
    }
    if (isChordLine(line)) {
      const chords = extractChordsWithPositions(line);
      const next = bodyLines[i + 1];
      if (next !== undefined && next.trim() !== '' && !isChordLine(next)) {
        out.push({ type: 'chord-lyric', chords, text: next });
        i++;
      } else {
        out.push({ type: 'chord', chords });
      }
    } else {
      out.push({ type: 'lyric', text: line });
    }
  }
  return out;
}
