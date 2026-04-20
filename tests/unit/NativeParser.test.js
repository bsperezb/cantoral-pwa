import { describe, it, expect } from 'vitest';
import { parseNative } from '../../src/services/parsers/NativeParser.js';

const SAMPLE = `---
title: Como el Ciervo
artist: Marcos Witt
key: G
tempo: 70
tags:
  - adoracion
  - entrada
categories:
  entrada:
    - tranquilo
  adoracion:
    - intimo
---

[Verso]
G            Em
Como el ciervo busca
    C              D
Por las aguas sediento

[Coro]
G              Em
Así, Señor, te busco
`;

describe('parseNative', () => {
  it('extrae la metadata del frontmatter', () => {
    const song = parseNative(SAMPLE, { fallbackId: 'como-el-ciervo' });
    expect(song.metadata.title).toBe('Como el Ciervo');
    expect(song.metadata.artist).toBe('Marcos Witt');
    expect(song.metadata.key).toBe('G');
    expect(song.metadata.tempo).toBe(70);
    expect(song.metadata.tags).toEqual(['adoracion', 'entrada']);
    expect(song.metadata.categories.entrada).toEqual(['tranquilo']);
    expect(song.metadata.categories.adoracion).toEqual(['intimo']);
  });

  it('parsea secciones con sus tipos normalizados', () => {
    const song = parseNative(SAMPLE, { fallbackId: 'como-el-ciervo' });
    const types = song.sections.map((s) => s.type);
    expect(types).toContain('verse');
    expect(types).toContain('chorus');
  });

  it('agrupa líneas de acordes con la letra que les sigue', () => {
    const song = parseNative(SAMPLE, { fallbackId: 'como-el-ciervo' });
    const verse = song.sections.find((s) => s.type === 'verse');
    const pair = verse.lines.find((l) => l.type === 'chord-lyric');
    expect(pair).toBeDefined();
    expect(pair.text).toContain('Como el ciervo');
    expect(pair.chords.map((c) => c.chord)).toEqual(['G', 'Em']);
  });

  it('reporta sourceFormat=native', () => {
    const song = parseNative(SAMPLE, { fallbackId: 'como-el-ciervo' });
    expect(song.sourceFormat).toBe('native');
  });

  it('lanza error si no hay frontmatter', () => {
    expect(() => parseNative('sin frontmatter')).toThrow();
  });
});
