<script setup>
import BaseTag from '../atoms/BaseTag.vue';
defineProps({ tags: { type: Array, default: () => [] } });
</script>

<template>
  <div class="tag-group">
    <BaseTag v-for="t in tags" :key="t" tone="primary">{{ t }}</BaseTag>
  </div>
</template>

<style scoped>
.tag-group {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-1);
}
</style>
