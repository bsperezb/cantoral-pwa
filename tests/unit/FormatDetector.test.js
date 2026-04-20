import { describe, it, expect } from 'vitest';
import { detectFormat } from '../../src/services/parsers/FormatDetector.js';

describe('detectFormat', () => {
  it('detecta nativo con frontmatter', () => {
    expect(detectFormat('---\ntitle: X\n---\nCuerpo')).toBe('native');
  });
  it('detecta laCuerda con header ====', () => {
    expect(detectFormat('=====================================\n| ARTISTA: X |\n=====')).toBe(
      'lacuerda'
    );
  });
  it('detecta laCuerda por campo ARTISTA sin header decorativo', () => {
    expect(detectFormat('| ARTISTA: Alguien |\nLetra')).toBe('lacuerda');
  });
  it('hace fallback a laCuerda', () => {
    expect(detectFormat('C   G\nHola mundo')).toBe('lacuerda');
  });
});
