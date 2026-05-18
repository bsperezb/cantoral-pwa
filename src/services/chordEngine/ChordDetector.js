import { ENGLISH_CHORD_RE, LATIN_CHORD_RE } from './constants.js';

const LATIN_CHORD_RE_I = new RegExp(LATIN_CHORD_RE.source, 'i');

const LATIN_ROOT_NORMALIZE = new Map([
  ['do', 'Do'],
  ['re', 'Re'],
  ['mi', 'Mi'],
  ['fa', 'Fa'],
  ['sol', 'Sol'],
  ['la', 'La'],
  ['si', 'Si'],
]);

/**
 * Normaliza un acorde a su forma canónica.
 * - Inglés: respeta mayúsculas en la raíz (sin cambios).
 * - Latino: acepta cualquier caja en la raíz (DO/do/Do → Do); calidad pasa a minúsculas.
 */
export function normalizeChordToken(token) {
  if (!token) return token;
  const cleaned = token.replace(/[(),.;:]/g, '').trim();
  if (!cleaned) return cleaned;
  if (ENGLISH_CHORD_RE.test(cleaned)) return cleaned;
  const la = cleaned.match(LATIN_CHORD_RE_I);
  if (la) {
    const root = LATIN_ROOT_NORMALIZE.get(la[1].toLowerCase()) ?? la[1];
    const accidental = la[2] ?? '';
    const quality = (la[3] ?? '').toLowerCase();
    let result = root + accidental + quality;
    if (la[4]) {
      const bassRoot = LATIN_ROOT_NORMALIZE.get(la[4].toLowerCase()) ?? la[4];
      result += '/' + bassRoot + (la[5] ?? '');
    }
    return result;
  }
  return cleaned;
}

/**
 * Comprueba si un token individual es un acorde válido (inglés o latino).
 * @param {string} token
 * @returns {boolean}
 */
export function isChordToken(token) {
  if (!token) return false;
  const cleaned = token.replace(/[(),.;:]/g, '').trim();
  if (cleaned.length === 0) return false;
  if (ENGLISH_CHORD_RE.test(cleaned)) return true;
  return LATIN_CHORD_RE_I.test(cleaned);
}

/**
 * Decide si una línea de texto es "de acordes".
 * Heurística: ≥70% de los tokens no vacíos deben ser acordes válidos,
 * y debe contener al menos un acorde.
 * @param {string} line
 * @param {number} [threshold=0.7]
 * @returns {boolean}
 */
const SEPARATOR_RE = /^[-|:*=_.,;]+$/;

export function isChordLine(line, threshold = 0.7) {
  const rawTokens = line.trim().split(/\s+/).filter(Boolean);
  if (rawTokens.length === 0) return false;
  // Descarta separadores puros (- | : etc.) al calcular la proporción.
  const tokens = rawTokens.filter((t) => !SEPARATOR_RE.test(t));
  if (tokens.length === 0) return false;
  const chordTokens = tokens.filter(isChordToken);
  if (chordTokens.length === 0) return false;
  return chordTokens.length / tokens.length >= threshold;
}

/**
 * Extrae los acordes junto con su posición (columna) en la línea.
 * @param {string} line
 * @returns {Array<{ chord: string, column: number }>}
 */
export function extractChordsWithPositions(line) {
  const result = [];
  const re = /\S+/g;
  let match;
  while ((match = re.exec(line)) !== null) {
    const token = match[0];
    if (isChordToken(token)) {
      result.push({ chord: normalizeChordToken(token), column: match.index });
    }
  }
  return result;
}

/**
 * Extrae la raíz, alteración, calidad y bajo de un acorde.
 * @param {string} chord
 * @returns {{ root: string, accidental: string|null, quality: string, bassRoot: string|null, bassAccidental: string|null, notation: 'english'|'latin' } | null}
 */
export function parseChord(chord) {
  const cleaned = normalizeChordToken(chord);
  const en = cleaned.match(ENGLISH_CHORD_RE);
  if (en) {
    return {
      root: en[1],
      accidental: en[2] ?? null,
      quality: en[3] ?? '',
      bassRoot: en[4] ?? null,
      bassAccidental: en[5] ?? null,
      notation: 'english',
    };
  }
  const la = cleaned.match(LATIN_CHORD_RE);
  if (la) {
    return {
      root: la[1],
      accidental: la[2] ?? null,
      quality: la[3] ?? '',
      bassRoot: la[4] ?? null,
      bassAccidental: la[5] ?? null,
      notation: 'latin',
    };
  }
  return null;
}
