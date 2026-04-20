<script setup>
defineProps({
  value: { type: Number, default: 0 }, // 0..100
  label: { type: String, default: '' },
});
</script>

<template>
  <div
    class="base-progress"
    role="progressbar"
    :aria-valuenow="value"
    aria-valuemin="0"
    aria-valuemax="100"
    :aria-label="label"
  >
    <div class="base-progress__track">
      <div
        class="base-progress__fill"
        :style="{ width: `${Math.min(100, Math.max(0, value))}%` }"
      />
    </div>
  </div>
</template>

<style scoped>
.base-progress__track {
  height: 8px;
  width: 100%;
  border-radius: var(--radius-full);
  background: var(--color-surface-2);
  overflow: hidden;
}
.base-progress__fill {
  height: 100%;
  background: linear-gradient(90deg, var(--color-primary), var(--color-accent));
  transition: width var(--transition-base);
}
</style>
