import { groupChordLyricLines, slugify } from './utils.js';

/**
 * Parser YAML-lite para el frontmatter nativo.
 * Soporta: claves escalares (`key: value`), listas (`- item`) y objetos anidados un nivel.
 * NO pretende ser un YAML completo — sólo lo necesario para el formato propio.
 * @param {string} block
 */
function parseFrontmatter(block) {
  const meta = {};
  const lines = block.split('\n');
  let i = 0;
  while (i < lines.length) {
    const line = lines[i];
    if (!line.trim()) {
      i++;
      continue;
    }
    const kv = line.match(/^([a-zA-Z_][a-zA-Z0-9_]*):\s*(.*)$/);
    if (!kv) {
      i++;
      continue;
    }
    const key = kv[1];
    const value = kv[2].trim();

    if (value !== '') {
      meta[key] = value;
      i++;
      continue;
    }

    // Inspecciona la siguiente línea no-vacía para decidir lista vs objeto.
    let j = i + 1;
    while (j < lines.length && !lines[j].trim()) j++;
    if (j >= lines.length) {
      meta[key] = null;
      break;
    }

    const nextIndent = lines[j].match(/^(\s+)/);
    if (!nextIndent) {
      meta[key] = null;
      i++;
      continue;
    }

    const isList = /^\s+-\s+/.test(lines[j]);
    if (isList) {
      const list = [];
      while (j < lines.length) {
        const item = lines[j].match(/^\s+-\s+(.+)$/);
        if (!item) break;
        list.push(item[1].trim());
        j++;
      }
      meta[key] = list;
      i = j;
    } else {
      // Objeto anidado: recoge sub-claves mientras la indentación se mantenga.
      const baseIndent = nextIndent[1].length;
      const obj = {};
      while (j < lines.length) {
        const sub = lines[j].match(/^(\s+)([a-zA-Z_][a-zA-Z0-9_]*):\s*(.*)$/);
        if (!sub || sub[1].length < baseIndent) break;
        const subKey = sub[2];
        const subValue = sub[3].trim();
        if (subValue !== '') {
          obj[subKey] = subValue;
          j++;
        } else {
          // Sublista
          const subList = [];
          j++;
          while (j < lines.length) {
            const subItem = lines[j].match(/^(\s+)-\s+(.+)$/);
            if (!subItem || subItem[1].length <= baseIndent) break;
            subList.push(subItem[2].trim());
            j++;
          }
          obj[subKey] = subList;
        }
      }
      meta[key] = obj;
      i = j;
    }
  }
  return meta;
}

/**
 * Extrae secciones del cuerpo nativo: `[Verso]`, `[Coro]`, etc.
 * @param {string} body
 */
function parseSections(body) {
  const lines = body.split('\n');
  const sections = [];
  let current = { type: 'verse', label: null, raw: [] };
  for (const line of lines) {
    const header = line.trim().match(/^\[(.+)\]$/);
    if (header) {
      if (current.raw.length > 0) sections.push(current);
      const label = header[1].trim();
      current = { type: normalizeSectionType(label), label, raw: [] };
    } else {
      current.raw.push(line);
    }
  }
  if (current.raw.length > 0) sections.push(current);
  return sections
    .map((s) => ({
      type: s.type,
      label: s.label,
      lines: groupChordLyricLines(trimBlankEdges(s.raw)),
    }))
    .filter((s) => s.lines.length > 0);
}

function trimBlankEdges(lines) {
  let start = 0;
  let end = lines.length;
  while (start < end && !lines[start].trim()) start++;
  while (end > start && !lines[end - 1].trim()) end--;
  return lines.slice(start, end);
}

function normalizeSectionType(label) {
  const l = label.toLowerCase();
  if (l.startsWith('intro')) return 'intro';
  if (l.startsWith('coro') || l.startsWith('estribillo')) return 'chorus';
  if (l.startsWith('verso') || l.startsWith('estrofa')) return 'verse';
  if (l.startsWith('puente') || l.startsWith('bridge')) return 'bridge';
  if (l.startsWith('solo') || l.startsWith('instrument')) return 'solo';
  if (l.startsWith('final') || l.startsWith('outro')) return 'outro';
  return 'section';
}

/**
 * Parsea un canto en formato nativo (frontmatter YAML + cuerpo con [Secciones]).
 * @param {string} text
 * @param {{ fallbackId?: string }} [options]
 * @returns {import('./types.js').ParsedSong}
 */
export function parseNative(text, options = {}) {
  if (!text.startsWith('---')) {
    throw new Error('NativeParser: el texto no empieza con frontmatter "---"');
  }
  const end = text.indexOf('\n---', 3);
  if (end === -1) {
    throw new Error('NativeParser: frontmatter sin cierre "---"');
  }
  const rawFrontmatter = text.slice(3, end).replace(/^\n/, '');
  const body = text.slice(end + 4).replace(/^\n/, '');

  const meta = parseFrontmatter(rawFrontmatter);

  const title = meta.title ?? options.fallbackId ?? 'Sin título';
  const id = options.fallbackId ?? slugify(title);

  return {
    id,
    metadata: {
      title,
      artist: meta.artist ?? null,
      author: meta.author ?? null,
      album: meta.album ?? null,
      key: meta.key ?? null,
      tempo: meta.tempo ? Number(meta.tempo) || meta.tempo : null,
      tags: Array.isArray(meta.tags) ? meta.tags : [],
      categories:
        typeof meta.categories === 'object' && meta.categories !== null ? meta.categories : {},
    },
    sections: parseSections(body),
    sourceFormat: 'native',
  };
}
