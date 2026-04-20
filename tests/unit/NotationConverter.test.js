import { describe, it, expect } from 'vitest';
import { convertChord } from '../../src/services/chordEngine/NotationConverter.js';

describe('convertChord english ↔ latin', () => {
  it.each([
    ['C', 'latin', 'Do'],
    ['D', 'latin', 'Re'],
    ['G', 'latin', 'Sol'],
    ['Am', 'latin', 'Lam'],
    ['C#m7', 'latin', 'Do#m7'],
    ['Bb', 'latin', 'Sib'],
    ['F/C', 'latin', 'Fa/Do'],
    ['Do', 'english', 'C'],
    ['Rem7', 'english', 'Dm7'],
    ['Sol/Si', 'english', 'G/B'],
  ])('convert %s to %s = %s', (input, target, expected) => {
    expect(convertChord(input, target)).toBe(expected);
  });

  it('es idempotente al convertir ida y vuelta', () => {
    const original = 'F#m7b5/A';
    const round = convertChord(convertChord(original, 'latin'), 'english');
    expect(round).toBe(original);
  });

  it('deja intacto un token no acorde', () => {
    expect(convertChord('hola', 'latin')).toBe('hola');
  });
});
