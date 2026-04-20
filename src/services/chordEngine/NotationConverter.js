import { parseChord } from './ChordDetector.js';
import { ENGLISH_TO_LATIN, LATIN_TO_ENGLISH } from './constants.js';

function convertRoot(root, targetNotation) {
  if (targetNotation === 'latin') {
    return ENGLISH_TO_LATIN[root] ?? root;
  }
  return LATIN_TO_ENGLISH[root] ?? root;
}

/**
 * Convierte un acorde entre notación latina e inglesa.
 * @param {string} chord
 * @param {'english'|'latin'} targetNotation
 * @returns {string} acorde convertido (o el original si no parsea)
 */
export function convertChord(chord, targetNotation) {
  const parsed = parseChord(chord);
  if (!parsed) return chord;
  if (parsed.notation === targetNotation) return chord;

  const newRoot = convertRoot(parsed.root, targetNotation);
  const bassRoot = parsed.bassRoot ? convertRoot(parsed.bassRoot, targetNotation) : null;

  let result = newRoot + (parsed.accidental ?? '') + parsed.quality;
  if (bassRoot) {
    result += '/' + bassRoot + (parsed.bassAccidental ?? '');
  }
  return result;
}
