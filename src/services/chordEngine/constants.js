// Escala cromática base en notación inglesa (referencia canónica interna).
export const CHROMATIC_SHARP = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
export const CHROMATIC_FLAT = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];

// Mapa notación latina ↔ inglesa (nota raíz).
export const LATIN_TO_ENGLISH = {
  Do: 'C',
  Re: 'D',
  Mi: 'E',
  Fa: 'F',
  Sol: 'G',
  La: 'A',
  Si: 'B',
};

export const ENGLISH_TO_LATIN = Object.fromEntries(
  Object.entries(LATIN_TO_ENGLISH).map(([l, e]) => [e, l])
);

// Tonalidades que prefieren bemoles (para decidir sharp vs flat al transponer).
export const FLAT_KEYS = new Set(['F', 'Bb', 'Eb', 'Ab', 'Db', 'Gb', 'Cb']);

// Regex de acordes (raíz + calidad + extensiones + bajo invertido opcional).
// Inglés: C, C#, Db, Cm, Cmaj7, Csus4, C/G, Dm7, F#m7b5, etc.
const QUALITY =
  '(?:maj|min|m|dim|aug|sus|add)?(?:\\d{1,2})?(?:[b#]\\d{1,2})*(?:sus\\d?)?(?:add\\d{1,2})?';

export const ENGLISH_CHORD_RE = new RegExp(`^([A-G])([#b])?(${QUALITY})(?:/([A-G])([#b])?)?$`);

const LATIN_ROOT = '(?:Do|Re|Mi|Fa|Sol|La|Si)';
export const LATIN_CHORD_RE = new RegExp(
  `^(${LATIN_ROOT})([#b])?(${QUALITY})(?:/(${LATIN_ROOT})([#b])?)?$`
);

export const SECTION_MARKERS = new Set([
  'INTRO',
  'CORO',
  'ESTRIBILLO',
  'VERSO',
  'ESTROFA',
  'PUENTE',
  'SOLO',
  'FINAL',
  'OUTRO',
  'INTERLUDIO',
]);
