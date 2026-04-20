#!/usr/bin/env node
// Genera public/songs/index.json con el listado de cantos disponibles.
// Lee metadata básica tanto del formato nativo (frontmatter YAML simple)
// como del header de laCuerda.

import { readdirSync, readFileSync, writeFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { join, basename, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { dirname } from 'node:path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const SONGS_DIR = join(__dirname, '..', 'public', 'songs');

function hashContent(text) {
  return createHash('sha1').update(text).digest('hex').slice(0, 12);
}

function titleCase(s) {
  return s
    .toLowerCase()
    .split(/\s+/)
    .map((w) => (w.length > 0 ? w[0].toUpperCase() + w.slice(1) : w))
    .join(' ')
    .trim();
}

function parseNativeMetadata(text) {
  // Espera frontmatter entre dos líneas "---"
  if (!text.startsWith('---')) return null;
  const end = text.indexOf('\n---', 3);
  if (end === -1) return null;
  const block = text.slice(3, end).trim();
  const meta = {};
  let currentKey = null;
  let currentList = null;
  for (const rawLine of block.split('\n')) {
    if (!rawLine.trim()) continue;
    const listMatch = rawLine.match(/^\s*-\s+(.+)$/);
    if (listMatch && currentList) {
      currentList.push(listMatch[1].trim());
      continue;
    }
    const kv = rawLine.match(/^([a-zA-Z_]+):\s*(.*)$/);
    if (kv) {
      currentKey = kv[1];
      const value = kv[2].trim();
      if (value === '') {
        currentList = [];
        meta[currentKey] = currentList;
      } else {
        meta[currentKey] = value;
        currentList = null;
      }
    }
  }
  return meta;
}

function parseLaCuerdaMetadata(text) {
  // Busca líneas tipo "| ARTISTA: ...", "| CANCION: ..."
  if (!text.includes('lacuerda.net') && !text.startsWith('====')) return null;
  const meta = {};
  const re = /^\|\s*([A-ZÁÉÍÓÚÑ]+):\s*(.+?)\s*\|?\s*$/gm;
  let match;
  while ((match = re.exec(text)) !== null) {
    const key = match[1].toUpperCase();
    const value = match[2].replace(/\|$/, '').trim();
    if (key === 'ARTISTA') meta.artist = value;
    else if (key === 'CANCION') meta.title = titleCase(value);
    else if (key === 'AUTOR') meta.author = value;
    else if (key === 'ALBUM') meta.album = value;
    else if (key === 'TRANS') meta.transcriber = value;
  }
  return Object.keys(meta).length > 0 ? meta : null;
}

function extractMetadata(text, fallbackId) {
  return (
    parseNativeMetadata(text) ||
    parseLaCuerdaMetadata(text) || { title: titleCase(fallbackId.replace(/-/g, ' ')) }
  );
}

function main() {
  const entries = readdirSync(SONGS_DIR, { withFileTypes: true });
  const songs = [];
  for (const entry of entries) {
    if (!entry.isFile()) continue;
    if (extname(entry.name) !== '.song') continue;
    const id = basename(entry.name, '.song');
    const filePath = join(SONGS_DIR, entry.name);
    const text = readFileSync(filePath, 'utf8');
    const meta = extractMetadata(text, id);
    songs.push({
      id,
      file: `/songs/${entry.name}`,
      title: meta.title ?? id,
      artist: meta.artist ?? null,
      author: meta.author ?? null,
      album: meta.album ?? null,
      key: meta.key ?? null,
      tags: Array.isArray(meta.tags) ? meta.tags : [],
      hash: hashContent(text),
      size: Buffer.byteLength(text, 'utf8'),
    });
  }
  songs.sort((a, b) => a.title.localeCompare(b.title, 'es'));
  const manifest = {
    generatedAt: new Date().toISOString(),
    songs,
  };
  const outPath = join(SONGS_DIR, 'index.json');
  writeFileSync(outPath, `${JSON.stringify(manifest, null, 2)}\n`, 'utf8');
  console.warn(`[songs-manifest] ${songs.length} cantos → ${outPath}`);
}

main();
