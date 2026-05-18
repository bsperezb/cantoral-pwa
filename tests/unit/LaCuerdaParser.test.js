import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import { parseLaCuerda } from '../../src/services/parsers/LaCuerdaParser.js';

const __dirname = dirname(fileURLToPath(import.meta.url));
const REAL_SAMPLE = readFileSync(
  join(__dirname, '..', '..', 'EJEMPLO_LACUERDA.TXT'),
  'utf8'
);

describe('parseLaCuerda con el ejemplo real', () => {
  it('extrae metadata del header', () => {
    const song = parseLaCuerda(REAL_SAMPLE);
    expect(song.metadata.title).toBe('Mi Historia Entre Tus Dedos');
    expect(song.metadata.artist).toBe('Gianluca Grignani');
    expect(song.metadata.author).toBe('Gianluca Grignani');
    expect(song.metadata.album).toBe('Destinazione Paradiso');
    expect(song.metadata.transcriber).toBe('Marco');
  });

  it('infiere la tonalidad del primer acorde cuando no hay campo Tono', () => {
    const song = parseLaCuerda(REAL_SAMPLE);
    expect(song.metadata.key).toBe('Dm7');
  });

  it('detecta sección INTRO: inline', () => {
    const song = parseLaCuerda(REAL_SAMPLE);
    const intro = song.sections.find((s) => s.type === 'intro');
    expect(intro).toBeDefined();
    expect(intro.lines[0].type).toBe('chord');
    const chords = intro.lines[0].chords.map((c) => c.chord);
    expect(chords).toEqual(['Dm7', 'G', 'Cmaj7', 'Fmaj7']);
  });

  it('detecta sección CORO sin corchetes', () => {
    const song = parseLaCuerda(REAL_SAMPLE);
    const chorus = song.sections.find((s) => s.type === 'chorus');
    expect(chorus).toBeDefined();
    expect(chorus.label).toBe('CORO');
  });

  it('agrupa pares acorde/letra en el cuerpo', () => {
    const song = parseLaCuerda(REAL_SAMPLE);
    const bodySection = song.sections.find(
      (s) => s.type === 'verse' && s.lines.some((l) => l.type === 'chord-lyric')
    );
    expect(bodySection).toBeDefined();
    const pair = bodySection.lines.find((l) => l.type === 'chord-lyric');
    expect(pair.text).toContain('Yo pienso que');
    expect(pair.chords.map((c) => c.chord)).toEqual(['Dm7', 'G', 'Cmaj7', 'Fmaj7']);
  });

  it('descarta el footer legal de lacuerda.net', () => {
    const song = parseLaCuerda(REAL_SAMPLE);
    const stringified = JSON.stringify(song);
    expect(stringified).not.toContain('prohibe su');
    expect(stringified).not.toContain('uso privado');
  });

  it('reporta sourceFormat=lacuerda', () => {
    const song = parseLaCuerda(REAL_SAMPLE);
    expect(song.sourceFormat).toBe('lacuerda');
  });
});

describe('parseLaCuerda con acordes latinos en MAYÚSCULAS', () => {
  const sample = `=====================================================================
| ARTISTA: Test                                                     |
| CANCION: TEST                                                     |
=====================================================================

 DO          LAm          REm        SOL
Pan transformado en el cuerpo de Cristo

*Coro*

LAm     SOL     FA      DO
Eucaristía milagro de amor

guitar_man_10@hotmail.com

Demos Gracias a Dios por la vida!!
`;

  it('normaliza acordes latinos a forma canónica (Do, Lam, Rem, Sol)', () => {
    const song = parseLaCuerda(sample);
    const allChords = song.sections
      .flatMap((s) => s.lines)
      .flatMap((l) => l.chords ?? [])
      .map((c) => c.chord);
    expect(allChords).toContain('Do');
    expect(allChords).toContain('Lam');
    expect(allChords).toContain('Rem');
    expect(allChords).toContain('Sol');
    expect(allChords).toContain('Fa');
  });

  it('detecta *Coro* como sección referencia', () => {
    const song = parseLaCuerda(sample);
    const ref = song.sections.find((s) => s.isReference);
    expect(ref).toBeDefined();
    expect(ref.type).toBe('chorus');
    expect(ref.label).toBe('Coro');
  });

  it('recorta comentarios finales con email', () => {
    const song = parseLaCuerda(sample);
    const stringified = JSON.stringify(song);
    expect(stringified).not.toContain('hotmail.com');
    expect(stringified).not.toContain('Demos Gracias');
  });
});
