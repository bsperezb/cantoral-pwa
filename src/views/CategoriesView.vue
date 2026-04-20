<script setup>
import { onMounted } from 'vue';
import { useCategoriesStore } from '../stores/categories.store.js';
import BaseTag from '../components/atoms/BaseTag.vue';

const categoriesStore = useCategoriesStore();
onMounted(() => categoriesStore.load());
</script>

<template>
  <section class="categories">
    <h2>Categorías</h2>
    <ul class="categories__list">
      <li v-for="cat in categoriesStore.categories" :key="cat.id" class="categories__item">
        <h3>{{ cat.name }}</h3>
        <div class="categories__subs">
          <BaseTag v-for="sub in cat.subcategories" :key="sub.id" tone="neutral">
            {{ sub.name }}
          </BaseTag>
        </div>
      </li>
    </ul>
  </section>
</template>

<style scoped>
.categories {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}
.categories__list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}
.categories__item {
  padding: var(--space-3);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
}
.categories__item h3 {
  margin: 0 0 var(--space-2);
  font-size: var(--font-size-base);
}
.categories__subs {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-1);
}
</style>
