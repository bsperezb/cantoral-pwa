import {
  extractChordsWithPositions,
  isChordLine,
  parseChord,
} from '../services/chordEngine/ChordDetector.js';

/**
 * Composable con utilidades de detección de acordes.
 * Se expone como función plana porque no necesita estado reactivo.
 */
export function useChordParser() {
  return {
    isChordLine,
    extractChordsWithPositions,
    parseChord,
  };
}
