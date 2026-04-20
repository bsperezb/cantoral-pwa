import { ref, computed } from 'vue';
import { convertChord } from '../services/chordEngine/NotationConverter.js';

/**
 * Composable que expone conversión latino ↔ inglés.
 * @param {'english'|'latin'} [initial='english']
 */
export function useChordNotation(initial = 'english') {
  const notation = ref(initial);

  function toggle() {
    notation.value = notation.value === 'english' ? 'latin' : 'english';
  }

  const converter = computed(() => ({
    convert: (chord) => convertChord(chord, notation.value),
  }));

  return { notation, toggle, converter };
}
