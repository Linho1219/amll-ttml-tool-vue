<template>
  <Card class="ribbon">
    <template #content>
      <ContentProcessGroup />
      <LineAttrGroup />
      <WordAttrGroup />
      <TimeShiftGroup />
      <MarkGroup />
      <ViewGroup />
      <PerformanceGroup />
    </template>
  </Card>
</template>

<script setup lang="ts">
import { Card } from 'primevue'
import ContentProcessGroup from './groups/ContentProcessGroup.vue'
import LineAttrGroup from './groups/LineAttrGroup.vue'
import MarkGroup from './groups/MarkGroup.vue'
import PerformanceGroup from './groups/PerformanceGroup.vue'
import TimeShiftGroup from './groups/TimeShiftGroup.vue'
import ViewGroup from './groups/ViewGroup.vue'
import WordAttrGroup from './groups/WordAttrGroup.vue'
</script>

<style lang="scss">
.ribbon {
  border: 1px solid color-mix(in srgb, var(--p-zinc-600), transparent 85%);
  margin: 0 0.5rem;
  .p-card-body {
    padding: 0.2rem 0;
    display: block;
    overflow-x: auto;
    overflow-y: hidden;
  }
  .p-card-content {
    height: 8.5rem;
    display: flex;
    align-items: stretch;
    justify-content: flex-start;
    width: max-content;
  }
}
</style>
