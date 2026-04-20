<script setup>
import { computed, onMounted, ref, watch } from 'vue';
import { RouterLink } from 'vue-router';
import { useSongsStore } from '../stores/songs.store.js';
import { usePreferencesStore } from '../stores/preferences.store.js';
import { useTranspose } from '../composables/useTranspose.js';
import { useChordNotation } from '../composables/useChordNotation.js';
import SongViewer from '../components/organisms/SongViewer.vue';
import TransposeControl from '../components/organisms/TransposeControl.vue';
import BaseIcon from '../components/atoms/BaseIcon.vue';

const props = defineProps({ id: { type: String, required: true } });
const songsStore = useSongsStore();
const prefs = usePreferencesStore();

const record = ref(null);
const loading = ref(true);
const error = ref(null);

const { semitones, up, down, reset, transposer } = useTranspose({
  initialKey: null,
});
const { notation, toggle: toggleNotation, converter } = useChordNotation(prefs.notation);

watch(notation, (v) => (prefs.notation = v));

const transform = computed(() => (chord) => {
  const transposed = transposer.value.transpose(chord);
  return converter.value.convert(transposed);
});

async function load() {
  loading.value = true;
  error.value = null;
  try {
    if (songsStore.manifest.length === 0) await songsStore.loadManifest();
    const rec = await songsStore.getSong(props.id);
    record.value = rec;
  } catch (err) {
    error.value = err.message;
  } finally {
    loading.value = false;
  }
}

onMounted(async () => {
  if (!prefs.loaded) await prefs.load();
  notation.value = prefs.notation;
  await load();
});

watch(() => props.id, load);
</script>

<template>
  <div class="song-detail">
    <nav class="song-detail__nav">
      <RouterLink :to="{ name: 'home' }" class="song-detail__back" aria-label="Volver">
        <BaseIcon name="back" :size="20" />
        <span>Volver</span>
      </RouterLink>
    </nav>

    <p v-if="loading" class="song-detail__status">Cargando canto…</p>
    <p v-else-if="error" class="song-detail__status song-detail__status--error">{{ error }}</p>

    <template v-else-if="record">
      <div class="song-detail__toolbar">
        <TransposeControl
          :semitones="semitones"
          :notation="notation"
          @up="up"
          @down="down"
          @reset="reset"
          @toggle-notation="toggleNotation"
        />
      </div>
      <SongViewer :song="record.parsed" :transform="transform" />
    </template>
  </div>
</template>

<style scoped>
.song-detail {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}
.song-detail__nav {
  padding-block: var(--space-1);
}
.song-detail__back {
  display: inline-flex;
  align-items: center;
  gap: var(--space-1);
  color: var(--color-text-muted);
  font-size: var(--font-size-sm);
  padding: var(--space-1) var(--space-2);
  border-radius: var(--radius-md);
}
.song-detail__back:hover {
  background: var(--color-surface-2);
}
.song-detail__toolbar {
  position: sticky;
  top: 64px;
  z-index: 5;
  display: flex;
  justify-content: center;
  padding-block: var(--space-2);
  background: color-mix(in srgb, var(--color-bg) 90%, transparent);
  backdrop-filter: blur(6px);
}
.song-detail__status {
  text-align: center;
  padding-block: var(--space-6);
  color: var(--color-text-muted);
}
.song-detail__status--error {
  color: var(--color-danger);
}
</style>
