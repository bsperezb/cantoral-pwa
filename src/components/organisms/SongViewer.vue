<script setup>
import { computed } from 'vue';
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
</script>

<template>
  <article class="song-viewer">
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
        :class="['song-viewer__section', `song-viewer__section--${section.type}`]"
      >
        <h2 v-if="sectionTitle(section)" class="song-viewer__section-title">
          {{ sectionTitle(section) }}
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
}
.song-viewer__section {
  padding: var(--space-3);
  border-radius: var(--radius-md);
  background: var(--color-surface);
  border-left: 3px solid var(--color-primary);
}
.song-viewer__section--chorus {
  background: color-mix(in srgb, var(--color-primary) 6%, var(--color-surface));
  border-left-color: var(--color-accent);
}
.song-viewer__section--intro {
  border-left-color: var(--color-text-muted);
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
