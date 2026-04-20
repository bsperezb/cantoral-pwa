import { describe, it, expect } from 'vitest';
import {
  isChordToken,
  isChordLine,
  extractChordsWithPositions,
  parseChord,
} from '../../src/services/chordEngine/ChordDetector.js';

describe('isChordToken', () => {
  it.each([
    ['C', true],
    ['Cm', true],
    ['C#m7', true],
    ['Bb', true],
    ['Cmaj7', true],
    ['Dm7', true],
    ['C/G', true],
    ['F#m7b5', true],
    ['Csus4', true],
    ['Do', true],
    ['Rem', true],
    ['Solm7', true],
    ['Fa#', true],
    ['Do/Sol', true],
    ['hola', false],
    ['', false],
    ['123', false],
    ['H', false],
  ])('isChordToken(%s) === %s', (token, expected) => {
    expect(isChordToken(token)).toBe(expected);
  });
});

describe('isChordLine', () => {
  it('detecta una línea sólo con acordes', () => {
    expect(isChordLine('G   Em   C   D')).toBe(true);
  });
  it('detecta una línea mezclada con mayoría de acordes', () => {
    expect(isChordLine('Dm7  -  G  -  Cmaj7')).toBe(true);
  });
  it('rechaza una línea de letra', () => {
    expect(isChordLine('Como el ciervo busca')).toBe(false);
  });
  it('rechaza una línea vacía', () => {
    expect(isChordLine('   ')).toBe(false);
  });
});

describe('extractChordsWithPositions', () => {
  it('mantiene las columnas originales', () => {
    const line = ' Dm7          G            Cmaj7                      Fmaj7';
    const result = extractChordsWithPositions(line);
    expect(result.map((r) => r.chord)).toEqual(['Dm7', 'G', 'Cmaj7', 'Fmaj7']);
    expect(result[0].column).toBe(1);
    expect(result[1].column).toBe(14);
  });
});

describe('parseChord', () => {
  it('parsea un acorde inglés simple', () => {
    expect(parseChord('C')).toMatchObject({
      root: 'C',
      accidental: null,
      notation: 'english',
    });
  });
  it('parsea un acorde con bajo invertido', () => {
    expect(parseChord('C/G')).toMatchObject({
      root: 'C',
      bassRoot: 'G',
      notation: 'english',
    });
  });
  it('parsea un acorde latino', () => {
    expect(parseChord('Rem7')).toMatchObject({
      root: 'Re',
      quality: 'm7',
      notation: 'latin',
    });
  });
  it('devuelve null para tokens inválidos', () => {
    expect(parseChord('hola')).toBeNull();
  });
});
