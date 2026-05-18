<script setup>
import { computed, nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue';
import ChordLyricBlock from '../molecules/ChordLyricBlock.vue';
import ChordLine from '../molecules/ChordLine.vue';

const props = defineProps({
  song: { type: Object, required: true },
  transform: { type: Function, default: (c) => c },
});

const sectionTitle = (section) => {
  if (section.label) return section.label;
  switch (section.type) {
    case 'intro':
      return 'Intro';
    case 'chorus':
      return 'Coro';
    case 'verse':
      return 'Verso';
    case 'bridge':
      return 'Puente';
    case 'solo':
      return 'Solo';
    case 'outro':
      return 'Final';
    default:
      return '';
  }
};

const hasSections = computed(() => props.song.sections?.length > 0);

// Fit-to-width: reduce la tipografía justo lo necesario para que la línea
// más ancha (acordes o letra) entre sin scroll horizontal. Reset → medir → escalar.
const MIN_SCALE = 0.5;
const root = ref(null);
const fitScale = ref(1);
let observer = null;
let measuring = false;

const measure = async () => {
  if (!root.value || measuring) return;
  measuring = true;
  fitScale.value = 1;
  await nextTick();
  const sections = root.value.querySelectorAll('.song-viewer__section');
  let scale = 1;
  for (const section of sections) {
    const available = section.clientWidth;
    if (!available) continue;
    const candidates = section.querySelectorAll(
      '.chord-lyric__chords, .chord-lyric__text, .song-viewer__lyric, .chord-line'
    );
    let needed = 0;
    candidates.forEach((el) => {
      if (el.scrollWidth > needed) needed = el.scrollWidth;
    });
    if (needed > available) {
      scale = Math.min(scale, available / needed);
    }
  }
  fitScale.value = Math.max(MIN_SCALE, scale);
  measuring = false;
};

const scheduleMeasure = () => {
  nextTick(measure);
};

onMounted(() => {
  scheduleMeasure();
  if (typeof ResizeObserver !== 'undefined') {
    observer = new ResizeObserver(() => scheduleMeasure());
    if (root.value) observer.observe(root.value);
  }
});

onBeforeUnmount(() => {
  observer?.disconnect();
  observer = null;
});

watch(() => [props.song, props.transform], scheduleMeasure);
</script>

<template>
  <article class="song-viewer" ref="root" :style="{ '--song-fit-scale': fitScale }">
    <header class="song-viewer__header">
      <h1 class="song-viewer__title">{{ song.metadata.title }}</h1>
      <p v-if="song.metadata.artist" class="song-viewer__artist">{{ song.metadata.artist }}</p>
      <div v-if="song.metadata.key || song.metadata.tempo" class="song-viewer__meta">
        <span v-if="song.metadata.key"
          >Tonalidad: <strong>{{ song.metadata.key }}</strong></span
        >
        <span v-if="song.metadata.tempo"
          >Tempo: <strong>{{ song.metadata.tempo }}</strong></span
        >
      </div>
    </header>

    <div v-if="hasSections" class="song-viewer__body">
      <section
        v-for="(section, i) in song.sections"
        :key="i"
        :class="[
          'song-viewer__section',
          `song-viewer__section--${section.type}`,
          { 'song-viewer__section--ref': section.isReference },
        ]"
      >
        <h2 v-if="sectionTitle(section)" class="song-viewer__section-title">
          <span v-if="section.isReference" aria-hidden="true">↺ </span>
          {{ sectionTitle(section) }}<span v-if="section.isReference"> (repetir)</span>
        </h2>
        <template v-for="(line, j) in section.lines" :key="j">
          <ChordLyricBlock
            v-if="line.type === 'chord-lyric'"
            :chords="line.chords"
            :text="line.text"
            :transform="transform"
          />
          <ChordLine
            v-else-if="line.type === 'chord'"
            :chords="line.chords"
            :transform="transform"
          />
          <p v-else-if="line.type === 'lyric'" class="song-viewer__lyric">{{ line.text }}</p>
          <div v-else class="song-viewer__gap" />
        </template>
      </section>
    </div>
    <p v-else class="song-viewer__empty">Este canto está vacío.</p>
  </article>
</template>

<style scoped>
.song-viewer {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
  min-width: 0;
}
.song-viewer__header {
  border-bottom: 1px solid var(--color-border);
  padding-bottom: var(--space-3);
}
.song-viewer__title {
  margin: 0;
  font-size: var(--font-size-2xl);
}
.song-viewer__artist {
  margin: 4px 0 0;
  color: var(--color-text-muted);
}
.song-viewer__meta {
  display: flex;
  gap: var(--space-4);
  margin-top: var(--space-2);
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
}
.song-viewer__body {
  display: flex;
  flex-direction: column;
  gap: var(--space-5);
  min-width: 0;
}
.song-viewer__section {
  padding: var(--space-3);
  border-radius: var(--radius-md);
  background: var(--color-surface);
  border-left: 3px solid var(--color-primary);
  min-width: 0;
  overflow: hidden;
}
.song-viewer__section--chorus {
  background: color-mix(in srgb, var(--color-primary) 6%, var(--color-surface));
  border-left-color: var(--color-accent);
}
.song-viewer__section--intro {
  border-left-color: var(--color-text-muted);
}
.song-viewer__section--ref {
  background: transparent;
  border-style: dashed;
  border-width: 1px;
  border-left-width: 3px;
  padding-block: var(--space-2);
}
.song-viewer__section--ref .song-viewer__section-title {
  font-style: italic;
  color: var(--color-primary);
  margin: 0;
}
.song-viewer__section-title {
  margin: 0 0 var(--space-2);
  font-size: var(--font-size-sm);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: var(--color-text-muted);
  font-weight: 600;
}
.song-viewer__lyric {
  margin: 0;
  font-family: var(--font-mono);
  white-space: pre-wrap;
  font-size: calc(var(--font-size-base) * var(--song-fit-scale, 1));
}
.song-viewer__gap {
  height: var(--space-2);
}
.song-viewer__empty {
  padding: var(--space-6);
  text-align: center;
  color: var(--color-text-muted);
}
</style>
