<script setup>
import { computed, onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useRepertoiresStore } from '../stores/repertoires.store.js';
import { useSongsStore } from '../stores/songs.store.js';
import BaseIcon from '../components/atoms/BaseIcon.vue';

const route = useRoute();
const router = useRouter();
const store = useRepertoiresStore();
const songsStore = useSongsStore();

const id = computed(() => route.params.id);
const rep = computed(() => store.getById(id.value));
const stepIndex = ref(0);

onMounted(async () => {
  if (!store.loaded) await store.load();
  if (!songsStore.manifest.length) await songsStore.loadManifest();
  if (!rep.value) {
    router.replace({ name: 'repertoires' });
    return;
  }
  const fromQuery = Number(route.query.moment);
  if (Number.isFinite(fromQuery)) {
    stepIndex.value = Math.max(0, Math.min(rep.value.moments.length - 1, fromQuery));
  }
});

watch(stepIndex, (v) => {
  router.replace({ query: { ...route.query, moment: String(v) } });
});

const moments = computed(() => rep.value?.moments ?? []);
const current = computed(() => moments.value[stepIndex.value] ?? null);
const next = computed(() => moments.value[stepIndex.value + 1] ?? null);
const prev = computed(() => moments.value[stepIndex.value - 1] ?? null);
const progress = computed(() => {
  if (!moments.value.length) return 0;
  return ((stepIndex.value + 1) / moments.value.length) * 100;
});

const songsForCurrent = computed(() => {
  if (!current.value) return [];
  return current.value.songIds.map((sid) => songsStore.byId.get(sid)).filter(Boolean);
});

function goPrev() {
  if (stepIndex.value > 0) stepIndex.value -= 1;
}
function goNext() {
  if (stepIndex.value < moments.value.length - 1) stepIndex.value += 1;
}
function openSong(songId) {
  router.push({
    name: 'song-detail',
    params: { id: songId },
    query: { rep: id.value, moment: String(stepIndex.value) },
  });
}
function exit() {
  router.push({ name: 'repertoires' });
}
</script>

<template>
  <section v-if="rep" class="present">
    <header class="present__head">
      <button type="button" class="present__icon-btn" aria-label="Volver" @click="exit">
        <BaseIcon name="chevron-left" :size="22" />
      </button>
      <div class="present__title-wrap">
        <h1 class="present__title">{{ rep.name }}</h1>
        <p class="present__sub">Modo presentación</p>
      </div>
      <button
        type="button"
        class="present__icon-btn"
        aria-label="Cerrar presentación"
        @click="exit"
      >
        <BaseIcon name="close" :size="22" />
      </button>
    </header>

    <div class="present__progress">
      <div class="present__progress-row">
        <span class="present__badge">En curso</span>
        <span class="present__step">{{ stepIndex + 1 }} / {{ moments.length || 1 }}</span>
      </div>
      <div class="present__bar">
        <div class="present__bar-fill" :style="{ width: `${progress}%` }" />
      </div>
    </div>

    <div v-if="current" class="present__moment">
      <span class="present__moment-tag">Momento {{ stepIndex + 1 }}</span>
      <h2 class="present__moment-title">{{ current.title }}</h2>
      <p v-if="songsForCurrent.length" class="present__moment-desc">
        Selecciona un canto para ver la letra y acordes.
      </p>
      <p v-else class="present__moment-empty">No hay cantos asignados a este momento.</p>

      <ul v-if="songsForCurrent.length" class="present__songs">
        <li v-for="(song, i) in songsForCurrent" :key="song.id">
          <button
            type="button"
            :class="['present__song', { 'present__song--first': i === 0 }]"
            @click="openSong(song.id)"
          >
            <span class="present__song-idx">{{ i + 1 }}</span>
            <span class="present__song-info">
              <span class="present__song-title">{{ song.title }}</span>
              <span v-if="song.artist" class="present__song-artist">{{ song.artist }}</span>
            </span>
            <BaseIcon name="chevron-right" :size="18" />
          </button>
        </li>
      </ul>
    </div>
    <div v-else class="present__moment present__moment--empty">
      <p>Este repertorio no tiene momentos.</p>
      <button
        type="button"
        class="present__edit-btn"
        @click="router.push({ name: 'repertoire-edit', params: { id: rep.id } })"
      >
        Editar repertorio
      </button>
    </div>

    <div class="present__cta">
      <button
        type="button"
        class="present__prev"
        :disabled="!prev"
        :aria-label="prev ? `Anterior: ${prev.title}` : 'Sin anterior'"
        @click="goPrev"
      >
        <BaseIcon name="chevron-left" :size="18" />
        <span>Anterior</span>
      </button>
      <button
        v-if="next"
        type="button"
        class="present__next"
        :aria-label="`Siguiente momento: ${next.title}`"
        @click="goNext"
      >
        <span class="present__next-stack">
          <span class="present__next-label">Siguiente</span>
          <span class="present__next-title">{{ next.title }}</span>
        </span>
        <BaseIcon name="chevron-right" :size="20" />
      </button>
      <button v-else type="button" class="present__next present__next--end" @click="exit">
        <BaseIcon name="check" :size="18" />
        <span>Terminar</span>
      </button>
    </div>
  </section>
  <p v-else class="present__loading">Cargando…</p>
</template>

<style scoped>
.present {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  min-height: calc(100dvh - var(--space-6));
}
.present__loading {
  text-align: center;
  padding: var(--space-5);
  color: var(--color-text-muted);
}
.present__head {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  padding-bottom: var(--space-2);
  border-bottom: 1px solid var(--color-border);
}
.present__icon-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 44px;
  min-height: 44px;
  border-radius: var(--radius-md);
  background: transparent;
  color: var(--color-text);
}
.present__icon-btn:hover {
  background: var(--color-surface-2);
}
.present__title-wrap {
  flex: 1;
  min-width: 0;
}
.present__title {
  margin: 0;
  font-size: var(--font-size-base);
  font-weight: 700;
  color: var(--color-text);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.present__sub {
  margin: 2px 0 0;
  font-size: var(--font-size-xs);
  color: var(--color-text-muted);
}
.present__progress {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}
.present__progress-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.present__badge {
  display: inline-flex;
  padding: 4px 10px;
  border-radius: var(--radius-full);
  background: var(--color-primary);
  color: var(--color-primary-contrast);
  font-size: var(--font-size-xs);
  font-weight: 700;
}
.present__step {
  font-size: var(--font-size-xs);
  color: var(--color-text-muted);
  font-weight: 600;
}
.present__bar {
  height: 6px;
  border-radius: var(--radius-full);
  background: var(--color-surface-2);
  overflow: hidden;
}
.present__bar-fill {
  height: 100%;
  background: var(--color-primary);
  border-radius: var(--radius-full);
  transition: width var(--transition-normal, 240ms) ease-out;
}
.present__moment {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  padding-block: var(--space-2);
}
.present__moment-tag {
  align-self: flex-start;
  font-size: var(--font-size-xs);
  font-weight: 700;
  color: var(--color-primary);
  background: color-mix(in srgb, var(--color-primary) 14%, transparent);
  padding: 2px 10px;
  border-radius: var(--radius-full);
}
.present__moment-title {
  margin: 0;
  font-size: var(--font-size-2xl);
  font-weight: 700;
  color: var(--color-text);
}
.present__moment-desc {
  margin: 0;
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
}
.present__moment-empty {
  margin: 0;
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
}
.present__moment--empty {
  align-items: center;
  text-align: center;
  padding: var(--space-5);
}
.present__songs {
  list-style: none;
  margin: var(--space-2) 0 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}
.present__song {
  width: 100%;
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3);
  border-radius: var(--radius-md);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  color: var(--color-text);
  min-height: 64px;
}
.present__song:hover {
  background: var(--color-surface-2);
}
.present__song--first {
  border-color: var(--color-primary);
  border-width: 1.5px;
}
.present__song-idx {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: var(--radius-full);
  background: var(--color-surface-2);
  color: var(--color-text-muted);
  font-weight: 700;
  font-size: var(--font-size-sm);
  flex-shrink: 0;
}
.present__song--first .present__song-idx {
  background: var(--color-primary);
  color: var(--color-primary-contrast);
}
.present__song-info {
  flex: 1;
  text-align: left;
  display: flex;
  flex-direction: column;
  gap: 2px;
  min-width: 0;
}
.present__song-title {
  font-weight: 700;
  font-size: var(--font-size-base);
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.present__song-artist {
  font-size: var(--font-size-xs);
  color: var(--color-text-muted);
}
.present__edit-btn {
  margin-top: var(--space-3);
  padding: var(--space-2) var(--space-4);
  border-radius: var(--radius-md);
  background: var(--color-primary);
  color: var(--color-primary-contrast);
  font-weight: 600;
  min-height: 44px;
}

.present__cta {
  position: sticky;
  bottom: 0;
  background: var(--color-bg);
  padding-block: var(--space-2);
  display: flex;
  align-items: stretch;
  gap: var(--space-2);
  border-top: 1px solid var(--color-border);
  margin-top: var(--space-2);
}
.present__prev {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 4px;
  padding: 0 var(--space-3);
  min-height: 52px;
  border-radius: var(--radius-md);
  background: var(--color-surface-2);
  border: 1px solid var(--color-border);
  color: var(--color-text);
  font-weight: 600;
  font-size: var(--font-size-sm);
}
.present__prev:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}
.present__next {
  flex: 1;
  display: inline-flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-4);
  min-height: 52px;
  border-radius: var(--radius-md);
  background: var(--color-primary);
  color: var(--color-primary-contrast);
  font-weight: 700;
}
.present__next:hover {
  background: var(--color-primary-hover);
}
.present__next-stack {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  line-height: 1.1;
  min-width: 0;
  flex: 1;
}
.present__next-label {
  font-size: 10px;
  font-weight: 600;
  opacity: 0.75;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}
.present__next-title {
  font-size: var(--font-size-base);
  font-weight: 700;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 100%;
}
.present__next--end {
  justify-content: center;
  background: var(--color-success);
}
</style>
