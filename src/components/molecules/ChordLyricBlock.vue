<script setup>
import { computed } from 'vue';

const props = defineProps({
  chords: { type: Array, default: () => [] },
  text: { type: String, default: '' },
  transform: { type: Function, default: (c) => c }, // transpose/convert pipeline
});

/**
 * Renderiza el par acorde+letra preservando columnas.
 * Construye una línea de acordes en ancho monospace que se alinea
 * sobre la letra sin romper la fila cuando ésta hace wrap.
 */
const chordLine = computed(() => {
  if (props.chords.length === 0) return '';
  const maxCol = Math.max(...props.chords.map((c) => c.column + c.chord.length)) + 4;
  const buffer = Array(maxCol).fill(' ');
  for (const { chord, column } of props.chords) {
    const transformed = props.transform(chord);
    for (let i = 0; i < transformed.length; i++) {
      if (column + i < buffer.length) buffer[column + i] = transformed[i];
    }
  }
  return buffer.join('');
});
</script>

<template>
  <div class="chord-lyric">
    <pre v-if="chordLine.trim()" class="chord-lyric__chords" aria-hidden="true">{{
      chordLine
    }}</pre>
    <p v-if="text" class="chord-lyric__text">{{ text }}</p>
  </div>
</template>

<style scoped>
.chord-lyric {
  margin-block: var(--space-1);
  font-family: var(--font-mono);
}
.chord-lyric__chords {
  margin: 0;
  color: var(--color-chord);
  font-weight: 700;
  font-size: var(--font-size-sm);
  white-space: pre;
  overflow-x: auto;
  line-height: var(--line-height-tight);
  font-family: var(--font-mono);
}
.chord-lyric__text {
  margin: 0;
  color: var(--color-text);
  font-family: var(--font-mono);
  font-size: var(--font-size-base);
  white-space: pre-wrap;
  line-height: var(--line-height-normal);
}
</style>
