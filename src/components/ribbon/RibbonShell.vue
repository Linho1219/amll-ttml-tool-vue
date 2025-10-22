<template>
  <Card class="ribbon">
    <template #content>
      <slot></slot>
    </template>
  </Card>
</template>

<script setup lang="ts">
import { Card } from 'primevue'
</script>

<style lang="scss">
.ribbon {
  border: 1px solid color-mix(in srgb, var(--p-zinc-600), transparent 85%);
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
