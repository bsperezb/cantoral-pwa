<script setup>
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useRepertoiresStore } from '../stores/repertoires.store.js';
import { useSongsStore } from '../stores/songs.store.js';
import { TEMPLATES } from '../services/repertoireTemplates.js';
import MomentBlock from '../components/organisms/MomentBlock.vue';
import SongPickerSheet from '../components/molecules/SongPickerSheet.vue';
import BaseIcon from '../components/atoms/BaseIcon.vue';

const route = useRoute();
const router = useRouter();
const store = useRepertoiresStore();
const songsStore = useSongsStore();

const id = computed(() => route.params.id);
const rep = computed(() => store.getById(id.value));
const editingName = ref(false);
const nameDraft = ref('');

const pickerOpen = ref(false);
const pickerMomentId = ref(null);

onMounted(async () => {
  if (!store.loaded) await store.load();
  if (!songsStore.manifest.length) await songsStore.loadManifest();
  if (!rep.value) router.replace({ name: 'repertoires' });
});

const template = computed(() =>
  rep.value ? TEMPLATES[rep.value.templateType] ?? TEMPLATES.blank : null
);
const songsById = computed(() => songsStore.byId);
const excludedForPicker = computed(() => {
  if (!pickerMomentId.value || !rep.value) return [];
  const m = rep.value.moments.find((x) => x.id === pickerMomentId.value);
  return m?.songIds ?? [];
});

function startEditName() {
  nameDraft.value = rep.value.name;
  editingName.value = true;
}
async function commitName() {
  const clean = nameDraft.value.trim();
  if (clean && clean !== rep.value.name) await store.update(rep.value.id, { name: clean });
  editingName.value = false;
}

async function addMoment() {
  const title = window.prompt('Nombre del momento:', 'Nuevo momento');
  if (!title) return;
  await store.addMoment(rep.value.id, title.trim());
}
async function renameMoment(moment, newTitle) {
  await store.updateMoment(rep.value.id, moment.id, { title: newTitle });
}
async function removeMoment(moment) {
  if (!window.confirm(`¿Eliminar "${moment.title}"?`)) return;
  await store.removeMoment(rep.value.id, moment.id);
}
async function moveMoment(moment, dir) {
  await store.moveMoment(rep.value.id, moment.id, dir);
}
function openPicker(momentId) {
  pickerMomentId.value = momentId;
  pickerOpen.value = true;
}
async function pickSong(songId) {
  await store.addSongToMoment(rep.value.id, pickerMomentId.value, songId);
  pickerOpen.value = false;
}
async function removeSong(moment, songId) {
  await store.removeSongFromMoment(rep.value.id, moment.id, songId);
}
async function moveSong(moment, songId, dir) {
  await store.moveSongInMoment(rep.value.id, moment.id, songId, dir);
}

const totalSongs = computed(
  () => rep.value?.moments.reduce((sum, m) => sum + m.songIds.length, 0) ?? 0
);
</script>

<template>
  <section v-if="rep" class="editor">
    <header class="editor__head">
      <button
        type="button"
        class="editor__icon-btn"
        aria-label="Volver"
        @click="router.push({ name: 'repertoires' })"
      >
        <BaseIcon name="chevron-left" :size="22" />
      </button>
      <div class="editor__title-wrap">
        <input
          v-if="editingName"
          v-model="nameDraft"
          class="editor__title-input"
          type="text"
          @blur="commitName"
          @keydown.enter.prevent="commitName"
        />
        <button v-else type="button" class="editor__title-btn" @click="startEditName">
          <h1 class="editor__title">{{ rep.name }}</h1>
          <BaseIcon name="pencil" :size="14" />
        </button>
        <p class="editor__sub">
          <span :class="['editor__tag', `editor__tag--${template.id}`]">
            <BaseIcon :name="template.icon" :size="11" />
            {{ template.name }}
          </span>
          ·
          {{ rep.moments.length }} momentos
          ·
          {{ totalSongs }} cantos
        </p>
      </div>
      <button
        type="button"
        class="editor__present"
        @click="router.push({ name: 'repertoire-present', params: { id: rep.id } })"
      >
        <BaseIcon name="play" :size="14" />
        Presentar
      </button>
    </header>

    <div class="editor__moments">
      <MomentBlock
        v-for="(m, i) in rep.moments"
        :key="m.id"
        :moment="m"
        :songs-by-id="songsById"
        :can-move-up="i > 0"
        :can-move-down="i < rep.moments.length - 1"
        @rename="renameMoment(m, $event)"
        @remove="removeMoment(m)"
        @move-up="moveMoment(m, -1)"
        @move-down="moveMoment(m, 1)"
        @add-song="openPicker(m.id)"
        @remove-song="removeSong(m, $event)"
        @move-song="(songId, dir) => moveSong(m, songId, dir)"
      />
    </div>

    <button type="button" class="editor__add-moment" @click="addMoment">
      <BaseIcon name="plus" :size="16" />
      Añadir momento
    </button>

    <SongPickerSheet
      :open="pickerOpen"
      :songs="songsStore.manifest"
      :excluded-ids="excludedForPicker"
      title="Añadir canto al momento"
      @close="pickerOpen = false"
      @select="pickSong"
    />
  </section>
  <p v-else class="editor__loading">Cargando repertorio…</p>
</template>

<style scoped>
.editor {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}
.editor__loading {
  text-align: center;
  padding: var(--space-5);
  color: var(--color-text-muted);
}
.editor__head {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}
.editor__icon-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 44px;
  min-height: 44px;
  border-radius: var(--radius-md);
  background: transparent;
  color: var(--color-text);
}
.editor__icon-btn:hover {
  background: var(--color-surface-2);
}
.editor__title-wrap {
  flex: 1;
  min-width: 0;
}
.editor__title-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: transparent;
  color: var(--color-text);
  padding: 2px 4px;
  border-radius: var(--radius-sm);
  max-width: 100%;
}
.editor__title-btn:hover {
  background: var(--color-surface-2);
}
.editor__title {
  margin: 0;
  font-size: var(--font-size-lg);
  font-weight: 700;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.editor__title-input {
  width: 100%;
  font: inherit;
  font-size: var(--font-size-lg);
  font-weight: 700;
  padding: 4px 6px;
  border-radius: var(--radius-sm);
  border: 1px solid var(--color-primary);
  background: var(--color-bg);
  color: var(--color-text);
}
.editor__sub {
  margin: 2px 0 0;
  font-size: var(--font-size-xs);
  color: var(--color-text-muted);
  display: inline-flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
}
.editor__tag {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 2px 8px;
  border-radius: var(--radius-full);
  font-weight: 600;
  background: color-mix(in srgb, var(--color-primary) 14%, transparent);
  color: var(--color-primary);
}
.editor__tag--blank {
  background: var(--color-surface-2);
  color: var(--color-text-muted);
}
.editor__present {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: var(--space-2) var(--space-3);
  min-height: 44px;
  border-radius: var(--radius-md);
  background: var(--color-primary);
  color: var(--color-primary-contrast);
  font-weight: 600;
  font-size: var(--font-size-sm);
}
.editor__present:hover {
  background: var(--color-primary-hover);
}
.editor__moments {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}
.editor__add-moment {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  min-height: 48px;
  border-radius: var(--radius-md);
  border: 1px dashed var(--color-border);
  background: transparent;
  color: var(--color-primary);
  font-weight: 600;
}
.editor__add-moment:hover {
  background: color-mix(in srgb, var(--color-primary) 8%, transparent);
}
</style>
