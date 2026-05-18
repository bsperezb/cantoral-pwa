import { defineStore } from 'pinia';
import { computed, ref } from 'vue';
import {
  loadAll,
  saveOne,
  deleteOne,
  getStorageMode,
} from '../services/repertoireStorage.js';
import { getTemplate } from '../services/repertoireTemplates.js';

const newId = () =>
  globalThis.crypto?.randomUUID?.() ??
  `r-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;

const now = () => Date.now();

const buildMoment = (title) => ({
  id: newId(),
  title,
  songIds: [],
});

export const useRepertoiresStore = defineStore('repertoires', () => {
  const items = ref([]);
  const loaded = ref(false);
  const storageMode = ref(getStorageMode());

  const sorted = computed(() =>
    [...items.value].sort((a, b) => b.updatedAt - a.updatedAt)
  );

  async function load() {
    items.value = await loadAll();
    loaded.value = true;
  }

  function getById(id) {
    return items.value.find((r) => r.id === id);
  }

  async function create({ name, templateType }) {
    const template = getTemplate(templateType);
    const ts = now();
    const rep = {
      id: newId(),
      name: name?.trim() || 'Nuevo repertorio',
      templateType: template.id,
      moments: template.moments.map(buildMoment),
      createdAt: ts,
      updatedAt: ts,
    };
    items.value.push(rep);
    await saveOne(rep);
    return rep;
  }

  async function update(id, patch) {
    const rep = getById(id);
    if (!rep) return null;
    Object.assign(rep, patch, { updatedAt: now() });
    await saveOne(rep);
    return rep;
  }

  async function remove(id) {
    items.value = items.value.filter((r) => r.id !== id);
    await deleteOne(id);
  }

  async function addMoment(repId, title = 'Momento') {
    const rep = getById(repId);
    if (!rep) return null;
    const moment = buildMoment(title);
    rep.moments.push(moment);
    rep.updatedAt = now();
    await saveOne(rep);
    return moment;
  }

  async function updateMoment(repId, momentId, patch) {
    const rep = getById(repId);
    const moment = rep?.moments.find((m) => m.id === momentId);
    if (!moment) return null;
    Object.assign(moment, patch);
    rep.updatedAt = now();
    await saveOne(rep);
    return moment;
  }

  async function removeMoment(repId, momentId) {
    const rep = getById(repId);
    if (!rep) return;
    rep.moments = rep.moments.filter((m) => m.id !== momentId);
    rep.updatedAt = now();
    await saveOne(rep);
  }

  async function moveMoment(repId, momentId, direction) {
    const rep = getById(repId);
    if (!rep) return;
    const i = rep.moments.findIndex((m) => m.id === momentId);
    const j = i + direction;
    if (i < 0 || j < 0 || j >= rep.moments.length) return;
    [rep.moments[i], rep.moments[j]] = [rep.moments[j], rep.moments[i]];
    rep.updatedAt = now();
    await saveOne(rep);
  }

  async function addSongToMoment(repId, momentId, songId) {
    const rep = getById(repId);
    const moment = rep?.moments.find((m) => m.id === momentId);
    if (!moment) return;
    if (moment.songIds.includes(songId)) return;
    moment.songIds.push(songId);
    rep.updatedAt = now();
    await saveOne(rep);
  }

  async function removeSongFromMoment(repId, momentId, songId) {
    const rep = getById(repId);
    const moment = rep?.moments.find((m) => m.id === momentId);
    if (!moment) return;
    moment.songIds = moment.songIds.filter((id) => id !== songId);
    rep.updatedAt = now();
    await saveOne(rep);
  }

  async function moveSongInMoment(repId, momentId, songId, direction) {
    const rep = getById(repId);
    const moment = rep?.moments.find((m) => m.id === momentId);
    if (!moment) return;
    const i = moment.songIds.indexOf(songId);
    const j = i + direction;
    if (i < 0 || j < 0 || j >= moment.songIds.length) return;
    [moment.songIds[i], moment.songIds[j]] = [moment.songIds[j], moment.songIds[i]];
    rep.updatedAt = now();
    await saveOne(rep);
  }

  return {
    items,
    sorted,
    loaded,
    storageMode,
    load,
    getById,
    create,
    update,
    remove,
    addMoment,
    updateMoment,
    removeMoment,
    moveMoment,
    addSongToMoment,
    removeSongFromMoment,
    moveSongInMoment,
  };
});
