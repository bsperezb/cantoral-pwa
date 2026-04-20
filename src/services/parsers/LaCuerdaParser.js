import { SECTION_MARKERS } from '../chordEngine/constants.js';
import { extractChordsWithPositions, isChordLine } from '../chordEngine/ChordDetector.js';
import { groupChordLyricLines, slugify, titleCase } from './utils.js';

const HEADER_FIELD_RE = /^\|\s*([A-ZÁÉÍÓÚÑ]+):\s*(.+?)\s*\|?\s*$/;
const HEADER_BORDER_RE = /^[=+-]{5,}|^\+[-=]+\+$/;

/**
 * Extrae el bloque de cabecera delimitado por `====` o ausente.
 * Devuelve { metadata, bodyStart } donde bodyStart es el índice de línea del cuerpo.
 */
function parseHeader(lines) {
  const meta = {};
  let bodyStart = 0;

  if (!lines[0] || !lines[0].startsWith('====')) {
    return { meta, bodyStart: 0 };
  }

  for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    if (line.startsWith('====')) {
      bodyStart = i + 1;
      break;
    }
    const field = line.match(HEADER_FIELD_RE);
    if (field) {
      const key = field[1].toUpperCase();
      const value = field[2].trim();
      if (key === 'ARTISTA') meta.artist = value;
      else if (key === 'CANCION' || key === 'CANCIÓN') meta.title = titleCase(value);
      else if (key === 'AUTOR') meta.author = value;
      else if (key === 'ALBUM' || key === 'ÁLBUM') meta.album = value;
      else if (key === 'TRANS' || key === 'TRANSCRIPTOR') meta.transcriber = value;
      else if (key === 'TONO' || key === 'KEY') meta.key = value;
      else if (key === 'TEMPO') meta.tempo = value;
      else if (key === 'CAPO') meta.capo = value;
    }
  }

  return { meta, bodyStart };
}

/**
 * Corta el disclaimer legal del footer de lacuerda.net.
 * El footer empieza en la siguiente línea `=====` después del cuerpo.
 */
function stripFooter(lines) {
  const footerStart = lines.findIndex(
    (line, i) => i > 0 && line.startsWith('====') && line.includes('lacuerda')
  );
  if (footerStart === -1) return lines;
  return lines.slice(0, footerStart);
}

/**
 * Heurística para decidir si una línea es marcador de sección sin corchetes.
 * Requiere: línea aislada, ≥3 letras, mayúsculas (permite números/espacios), y palabra reconocida.
 */
function matchBareSectionMarker(line) {
  const trimmed = line.trim();
  if (!trimmed) return null;
  if (trimmed.length > 40) return null;
  // Permite "CORO", "CORO 2", "VERSO 1", con posible ':' final.
  const m = trimmed.match(/^([A-ZÁÉÍÓÚÑ]{3,})(?:\s+\d+)?:?$/);
  if (!m) return null;
  const word = m[1];
  if (!SECTION_MARKERS.has(word)) return null;
  return { label: trimmed.replace(/:$/, ''), type: mapSectionType(word) };
}

function matchInlineIntro(line) {
  const m = line.match(/^INTRO\s*:\s*(.+)$/i);
  if (!m) return null;
  const content = m[1];
  // Extrae acordes ignorando separadores.
  const tokens = content.split(/\s+/).filter(Boolean);
  const chords = [];
  let col = line.indexOf(m[1]);
  let cursor = col;
  for (const token of tokens) {
    const tokenCol = line.indexOf(token, cursor);
    if (tokenCol !== -1 && !/^[-|]+$/.test(token)) {
      chords.push({ chord: token, column: tokenCol - col });
      cursor = tokenCol + token.length;
    }
  }
  return chords;
}

function mapSectionType(word) {
  switch (word) {
    case 'INTRO':
      return 'intro';
    case 'CORO':
    case 'ESTRIBILLO':
      return 'chorus';
    case 'VERSO':
    case 'ESTROFA':
      return 'verse';
    case 'PUENTE':
      return 'bridge';
    case 'SOLO':
    case 'INTERLUDIO':
      return 'solo';
    case 'FINAL':
    case 'OUTRO':
      return 'outro';
    default:
      return 'section';
  }
}

/**
 * Parsea el cuerpo (sin header ni footer) en secciones.
 */
function parseBody(bodyLines) {
  const sections = [];
  let current = { type: 'verse', label: null, raw: [] };

  const pushCurrent = () => {
    const cleaned = trimBlankEdges(current.raw);
    if (cleaned.length > 0) {
      sections.push({
        type: current.type,
        label: current.label,
        lines: groupChordLyricLines(cleaned),
      });
    }
  };

  for (let i = 0; i < bodyLines.length; i++) {
    const line = bodyLines[i];

    if (HEADER_BORDER_RE.test(line) && line.length > 10) {
      // Borde decorativo: ignorar.
      continue;
    }

    const introInline = matchInlineIntro(line);
    if (introInline) {
      pushCurrent();
      sections.push({
        type: 'intro',
        label: 'Intro',
        lines: [{ type: 'chord', chords: introInline }],
      });
      current = { type: 'verse', label: null, raw: [] };
      continue;
    }

    const marker = matchBareSectionMarker(line);
    if (marker) {
      pushCurrent();
      current = { type: marker.type, label: marker.label, raw: [] };
      continue;
    }

    current.raw.push(line);
  }
  pushCurrent();
  return sections;
}

function trimBlankEdges(lines) {
  let start = 0;
  let end = lines.length;
  while (start < end && !lines[start].trim()) start++;
  while (end > start && !lines[end - 1].trim()) end--;
  return lines.slice(start, end);
}

/**
 * @param {string} text
 * @param {{ fallbackId?: string }} [options]
 * @returns {import('./types.js').ParsedSong}
 */
export function parseLaCuerda(text, options = {}) {
  const allLines = text.split('\n');
  const { meta, bodyStart } = parseHeader(allLines);
  const withoutFooter = stripFooter(allLines.slice(bodyStart));
  const sections = parseBody(withoutFooter);

  const title = meta.title ?? options.fallbackId ?? 'Sin título';
  const id = options.fallbackId ?? slugify(title);

  // Si no hay key explícita, intentar inferirla del primer acorde.
  let key = meta.key ?? null;
  if (!key) {
    for (const section of sections) {
      for (const line of section.lines) {
        if (line.type === 'chord' || line.type === 'chord-lyric') {
          const first = line.chords?.[0];
          if (first) {
            key = first.chord;
            break;
          }
        }
      }
      if (key) break;
    }
  }

  return {
    id,
    metadata: {
      title,
      artist: meta.artist ?? null,
      author: meta.author ?? null,
      album: meta.album ?? null,
      key,
      tempo: meta.tempo ? Number(meta.tempo) || meta.tempo : null,
      tags: [],
      categories: {},
      transcriber: meta.transcriber ?? null,
      capo: meta.capo ?? null,
    },
    sections,
    sourceFormat: 'lacuerda',
  };
}

export const __internal = {
  parseHeader,
  parseBody,
  matchBareSectionMarker,
  matchInlineIntro,
  stripFooter,
  isChordLine,
  extractChordsWithPositions,
};
