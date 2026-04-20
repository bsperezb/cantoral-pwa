import { parseChord } from './ChordDetector.js';
import {
  CHROMATIC_FLAT,
  CHROMATIC_SHARP,
  ENGLISH_TO_LATIN,
  FLAT_KEYS,
  LATIN_TO_ENGLISH,
} from './constants.js';

function toEnglishRoot(root) {
  return LATIN_TO_ENGLISH[root] ?? root;
}

function toLatinRoot(root) {
  return ENGLISH_TO_LATIN[root] ?? root;
}

function rootIndex(root, accidental) {
  const english = toEnglishRoot(root);
  const note = english + (accidental ?? '');
  let idx = CHROMATIC_SHARP.indexOf(note);
  if (idx === -1) idx = CHROMATIC_FLAT.indexOf(note);
  return idx;
}

function buildRoot(index, { useFlats, notation }) {
  const scale = useFlats ? CHROMATIC_FLAT : CHROMATIC_SHARP;
  const englishNote = scale[((index % 12) + 12) % 12];
  // englishNote es algo como "C", "C#", "Db"...
  const accidentalMatch = englishNote.match(/^([A-G])([#b])?$/);
  const english = accidentalMatch[1];
  const accidental = accidentalMatch[2] ?? '';
  if (notation === 'latin') {
    return toLatinRoot(english) + accidental;
  }
  return english + accidental;
}

/**
 * Determina si la tonalidad destino prefiere bemoles.
 * @param {string|null} targetKey ej. 'F', 'Bb', 'G', 'Re'
 */
function keyPrefersFlats(targetKey) {
  if (!targetKey) return false;
  const parsed = parseChord(targetKey);
  const root = parsed ? parsed.root : targetKey;
  const accidental = parsed ? (parsed.accidental ?? '') : '';
  const english = toEnglishRoot(root) + accidental;
  return FLAT_KEYS.has(english);
}

/**
 * Transpone un acorde individual.
 * @param {string} chord
 * @param {number} semitones número de semitonos (puede ser negativo)
 * @param {{ targetKey?: string|null }} [options]
 * @returns {string}
 */
export function transposeChord(chord, semitones, options = {}) {
  if (semitones === 0) return chord;
  const parsed = parseChord(chord);
  if (!parsed) return chord;

  const useFlats = keyPrefersFlats(options.targetKey ?? null);

  const baseIdx = rootIndex(parsed.root, parsed.accidental);
  if (baseIdx === -1) return chord;
  const newRootStr = buildRoot(baseIdx + semitones, {
    useFlats,
    notation: parsed.notation,
  });

  let result = newRootStr + parsed.quality;

  if (parsed.bassRoot) {
    const bassIdx = rootIndex(parsed.bassRoot, parsed.bassAccidental);
    if (bassIdx !== -1) {
      const newBassStr = buildRoot(bassIdx + semitones, {
        useFlats,
        notation: parsed.notation,
      });
      result += '/' + newBassStr;
    } else {
      result += '/' + parsed.bassRoot + (parsed.bassAccidental ?? '');
    }
  }

  return result;
}

/**
 * Transpone todos los acordes de una línea, preservando las columnas.
 * @param {string} line
 * @param {number} semitones
 * @param {{ targetKey?: string|null }} [options]
 * @returns {string}
 */
export function transposeLine(line, semitones, options = {}) {
  return line.replace(/\S+/g, (token) => {
    const transposed = transposeChord(token, semitones, options);
    // Mantiene longitud original si es posible (para preservar alineación).
    if (transposed.length >= token.length) return transposed;
    return transposed + ' '.repeat(token.length - transposed.length);
  });
}
