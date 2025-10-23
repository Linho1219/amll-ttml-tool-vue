<template>
  <Card class="player">
    <template #content>
      <Button icon="pi pi-upload" severity="secondary" /><Button
        icon="pi pi-sliders-v"
        severity="secondary"
      />
      <Button icon="pi pi-caret-right" />
      <div style="flex: 1"></div>
      <Button icon="pi pi-chart-bar" severity="secondary" />
    </template>
  </Card>
</template>

<script setup lang="ts">
import { Button, Card } from 'primevue'
</script>

<style lang="scss">
.player {
  border: 1px solid color-mix(in srgb, var(--p-zinc-600), transparent 85%);
  .p-card-body {
    padding: 0.5rem;
  }
  .p-card-content {
    display: flex;
    gap: 0.5rem;
  }
}
</style>
