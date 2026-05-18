<script setup>
import { computed, onMounted, ref, nextTick } from 'vue';
import { useRouter } from 'vue-router';
import { useRepertoiresStore } from '../stores/repertoires.store.js';
import { useSongsStore } from '../stores/songs.store.js';
import RepertoireCard from '../components/molecules/RepertoireCard.vue';
import TemplateCard from '../components/molecules/TemplateCard.vue';
import BaseIcon from '../components/atoms/BaseIcon.vue';
import { TEMPLATE_LIST } from '../services/repertoireTemplates.js';

const store = useRepertoiresStore();
const songsStore = useSongsStore();
const router = useRouter();

const creating = ref(false);
const draftName = ref('');
const draftTemplate = ref('mass');
const nameInputRef = ref(null);

onMounted(async () => {
  if (!store.loaded) await store.load();
  if (!songsStore.manifest.length) await songsStore.loadManifest();
});

const repertoires = computed(() => store.sorted);
const empty = computed(() => store.loaded && repertoires.value.length === 0);

function openCreate() {
  draftName.value = '';
  draftTemplate.value = 'mass';
  creating.value = true;
  nextTick(() => nameInputRef.value?.focus());
}
function cancelCreate() {
  creating.value = false;
}
async function confirmCreate() {
  const name = draftName.value.trim() || 'Nuevo repertorio';
  const rep = await store.create({ name, templateType: draftTemplate.value });
  creating.value = false;
  router.push({ name: 'repertoire-edit', params: { id: rep.id } });
}

async function removeRepertoire(rep) {
  const ok = window.confirm(`¿Eliminar "${rep.name}"?`);
  if (ok) await store.remove(rep.id);
}
function edit(rep) {
  router.push({ name: 'repertoire-edit', params: { id: rep.id } });
}
function present(rep) {
  router.push({ name: 'repertoire-present', params: { id: rep.id } });
}
</script>

<template>
  <section class="reps">
    <header class="reps__head">
      <div>
        <h1 class="reps__title">Repertorios</h1>
        <p class="reps__sub">
          {{ repertoires.length }}
          {{ repertoires.length === 1 ? 'guardado' : 'guardados' }}
        </p>
      </div>
      <button type="button" class="reps__cta" @click="openCreate">
        <BaseIcon name="plus" :size="16" />
        Nuevo
      </button>
    </header>

    <div v-if="store.storageMode === 'session'" class="reps__notice" role="status">
      <BaseIcon name="info" :size="14" />
      <span>
        Instala la app para conservar tus repertorios. Por ahora viven en esta sesión del navegador.
      </span>
    </div>

    <p v-if="!store.loaded" class="reps__loading">Cargando…</p>

    <div v-else-if="empty" class="reps__empty">
      <BaseIcon name="list-music" :size="40" />
      <h2>Aún no hay repertorios</h2>
      <p>Crea uno para cuadrar la próxima misa o adoración.</p>
      <button type="button" class="reps__cta" @click="openCreate">
        <BaseIcon name="plus" :size="16" />
        Crear el primero
      </button>
    </div>

    <ul v-else class="reps__list">
      <li v-for="rep in repertoires" :key="rep.id">
        <RepertoireCard
          :repertoire="rep"
          @edit="edit(rep)"
          @present="present(rep)"
          @remove="removeRepertoire(rep)"
        />
      </li>
    </ul>

    <Teleport to="body">
      <Transition name="dialog">
        <div
          v-if="creating"
          class="dialog"
          role="dialog"
          aria-modal="true"
          aria-labelledby="rep-new-title"
          @click.self="cancelCreate"
        >
          <div class="dialog__panel">
            <header class="dialog__head">
              <h2 id="rep-new-title" class="dialog__title">Nuevo repertorio</h2>
              <button
                type="button"
                class="dialog__close"
                aria-label="Cerrar"
                @click="cancelCreate"
              >
                <BaseIcon name="close" :size="20" />
              </button>
            </header>

            <label class="dialog__field">
              <span>Nombre</span>
              <input
                ref="nameInputRef"
                v-model="draftName"
                type="text"
                placeholder="Ej. Misa del Domingo"
                @keydown.enter.prevent="confirmCreate"
              />
            </label>

            <fieldset class="dialog__field">
              <legend>Plantilla</legend>
              <div class="dialog__templates">
                <TemplateCard
                  v-for="t in TEMPLATE_LIST"
                  :key="t.id"
                  :template="t"
                  :selected="draftTemplate === t.id"
                  @select="draftTemplate = $event"
                />
              </div>
            </fieldset>

            <div class="dialog__actions">
              <button type="button" class="dialog__btn dialog__btn--ghost" @click="cancelCreate">
                Cancelar
              </button>
              <button type="button" class="dialog__btn dialog__btn--primary" @click="confirmCreate">
                Crear
              </button>
            </div>
          </div>
        </div>
      </Transition>
    </Teleport>
  </section>
</template>

<style scoped>
.reps {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}
.reps__head {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--space-3);
}
.reps__title {
  margin: 0;
  font-size: var(--font-size-2xl);
  color: var(--color-text);
}
.reps__sub {
  margin: 2px 0 0;
  font-size: var(--font-size-sm);
  color: var(--color-text-muted);
}
.reps__cta {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: var(--space-2) var(--space-3);
  min-height: 44px;
  background: var(--color-primary);
  color: var(--color-primary-contrast);
  font-weight: 600;
  border-radius: var(--radius-md);
}
.reps__cta:hover {
  background: var(--color-primary-hover);
}
.reps__notice {
  display: flex;
  align-items: flex-start;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-3);
  background: color-mix(in srgb, var(--color-primary) 12%, transparent);
  color: var(--color-primary);
  border-radius: var(--radius-md);
  font-size: var(--font-size-sm);
  font-weight: 500;
}
.reps__loading {
  text-align: center;
  color: var(--color-text-muted);
  padding: var(--space-5);
}
.reps__empty {
  text-align: center;
  padding: var(--space-6) var(--space-4);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--space-2);
  color: var(--color-text-muted);
}
.reps__empty h2 {
  margin: var(--space-2) 0 0;
  color: var(--color-text);
  font-size: var(--font-size-lg);
}
.reps__list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

/* Dialog */
.dialog {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 1000;
  display: flex;
  align-items: flex-end;
  justify-content: center;
}
@media (min-width: 640px) {
  .dialog {
    align-items: center;
  }
}
.dialog__panel {
  background: var(--color-surface);
  width: 100%;
  max-width: 480px;
  max-height: 90dvh;
  overflow-y: auto;
  border-radius: var(--radius-lg) var(--radius-lg) 0 0;
  padding: var(--space-4);
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}
@media (min-width: 640px) {
  .dialog__panel {
    border-radius: var(--radius-lg);
  }
}
.dialog__head {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.dialog__title {
  margin: 0;
  font-size: var(--font-size-lg);
  color: var(--color-text);
}
.dialog__close {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 44px;
  min-height: 44px;
  border-radius: var(--radius-md);
  color: var(--color-text-muted);
  background: transparent;
}
.dialog__close:hover {
  background: var(--color-surface-2);
}
.dialog__field {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
  border: none;
  padding: 0;
  margin: 0;
}
.dialog__field > span,
.dialog__field > legend {
  font-size: var(--font-size-sm);
  font-weight: 600;
  color: var(--color-text-muted);
  padding: 0;
}
.dialog__field input {
  padding: var(--space-3);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background: var(--color-bg);
  color: var(--color-text);
  font: inherit;
  min-height: 44px;
}
.dialog__field input:focus {
  outline: none;
  border-color: var(--color-primary);
}
.dialog__templates {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-2);
}
@media (min-width: 480px) {
  .dialog__templates {
    grid-template-columns: repeat(3, 1fr);
  }
}
.dialog__actions {
  display: flex;
  justify-content: flex-end;
  gap: var(--space-2);
}
.dialog__btn {
  padding: var(--space-2) var(--space-4);
  min-height: 44px;
  border-radius: var(--radius-md);
  font-weight: 600;
}
.dialog__btn--ghost {
  background: transparent;
  color: var(--color-text);
}
.dialog__btn--ghost:hover {
  background: var(--color-surface-2);
}
.dialog__btn--primary {
  background: var(--color-primary);
  color: var(--color-primary-contrast);
}
.dialog__btn--primary:hover {
  background: var(--color-primary-hover);
}

.dialog-enter-active,
.dialog-leave-active {
  transition: opacity var(--transition-fast);
}
.dialog-enter-active .dialog__panel,
.dialog-leave-active .dialog__panel {
  transition: transform var(--transition-normal, 220ms) ease-out;
}
.dialog-enter-from,
.dialog-leave-to {
  opacity: 0;
}
.dialog-enter-from .dialog__panel,
.dialog-leave-to .dialog__panel {
  transform: translateY(20px);
}
</style>
