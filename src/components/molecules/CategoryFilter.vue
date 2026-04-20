<script setup>
import BaseChip from '../atoms/BaseChip.vue';

defineProps({
  categories: { type: Array, default: () => [] },
  selectedId: { type: String, default: null },
});
defineEmits(['select']);
</script>

<template>
  <div class="category-filter" role="group" aria-label="Filtrar por categoría">
    <BaseChip :active="selectedId === null" @click="$emit('select', null)">Todas</BaseChip>
    <BaseChip
      v-for="cat in categories"
      :key="cat.id"
      :active="selectedId === cat.id"
      @click="$emit('select', cat.id)"
    >
      {{ cat.name }}
    </BaseChip>
  </div>
</template>

<style scoped>
.category-filter {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
  padding-block: var(--space-2);
  overflow-x: auto;
  scrollbar-width: none;
}
.category-filter::-webkit-scrollbar {
  display: none;
}
</style>
