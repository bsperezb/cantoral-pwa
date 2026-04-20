import { describe, it, expect } from 'vitest';
import {
  transposeChord,
  transposeLine,
} from '../../src/services/chordEngine/ChordTransposer.js';

describe('transposeChord', () => {
  it('sube un semitono', () => {
    expect(transposeChord('C', 1)).toBe('C#');
  });
  it('baja un semitono', () => {
    expect(transposeChord('C', -1)).toBe('B');
  });
  it('preserva la calidad del acorde', () => {
    expect(transposeChord('Cm7', 2)).toBe('Dm7');
    expect(transposeChord('Cmaj7', 5)).toBe('Fmaj7');
    expect(transposeChord('Csus4', 3)).toBe('D#sus4');
  });
  it('transpone bajo invertido', () => {
    expect(transposeChord('C/G', 2)).toBe('D/A');
  });
  it('usa bemoles si la tonalidad destino los prefiere', () => {
    expect(transposeChord('C', 1, { targetKey: 'Bb' })).toBe('Db');
    expect(transposeChord('C', 1, { targetKey: 'F' })).toBe('Db');
  });
  it('preserva notación latina', () => {
    expect(transposeChord('Do', 2)).toBe('Re');
    expect(transposeChord('Rem7', 5)).toBe('Solm7');
    expect(transposeChord('Do/Sol', 2)).toBe('Re/La');
  });
  it('recorre las 12 tonalidades sin romperse', () => {
    let chord = 'C';
    for (let i = 0; i < 12; i++) {
      chord = transposeChord(chord, 1);
      expect(chord.length).toBeGreaterThan(0);
    }
    // Tras 12 semitonos debe volver a C.
    expect(transposeChord('C', 12)).toBe('C');
  });
  it('deja intactos los tokens no acordes', () => {
    expect(transposeChord('hola', 3)).toBe('hola');
  });
});

describe('transposeLine', () => {
  it('transpone todos los acordes de una línea', () => {
    const input = 'C   G   Am   F';
    expect(transposeLine(input, 2).trim()).toBe('D   A   Bm   G');
  });
  it('mantiene separadores no-acorde', () => {
    expect(transposeLine('Dm7  -  G  -  Cmaj7', 2).trim().replace(/\s+/g, ' ')).toBe(
      'Em7 - A - Dmaj7'
    );
  });
});
