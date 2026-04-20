import { ref, computed } from 'vue';
import { transposeChord, transposeLine } from '../services/chordEngine/ChordTransposer.js';

/**
 * Composable de transposición reactivo.
 * @param {{ initialKey?: string|null }} [options]
 */
export function useTranspose(options = {}) {
  const semitones = ref(0);
  const targetKey = ref(options.initialKey ?? null);

  function up() {
    semitones.value = ((semitones.value + 1 + 6) % 12) - 6;
  }
  function down() {
    semitones.value = ((semitones.value - 1 + 6 + 12) % 12) - 6;
  }
  function reset() {
    semitones.value = 0;
  }

  const transposer = computed(() => ({
    transpose: (chord) => transposeChord(chord, semitones.value, { targetKey: targetKey.value }),
    transposeLine: (line) => transposeLine(line, semitones.value, { targetKey: targetKey.value }),
  }));

  return { semitones, targetKey, up, down, reset, transposer };
}
