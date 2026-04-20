<script setup>
defineProps({
  chords: { type: Array, default: () => [] },
  transform: { type: Function, default: (c) => c },
});
</script>

<template>
  <p class="chord-line">
    <span v-for="(c, i) in chords" :key="i" class="chord-line__chord"
      >{{ transform(c.chord)
      }}<span v-if="i < chords.length - 1" class="chord-line__sep">·</span></span
    >
  </p>
</template>

<style scoped>
.chord-line {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
  margin: 0;
  font-family: var(--font-mono);
  color: var(--color-chord);
  font-weight: 700;
  font-size: var(--font-size-sm);
}
.chord-line__sep {
  margin-left: var(--space-2);
  color: var(--color-text-muted);
  font-weight: 400;
}
</style>
