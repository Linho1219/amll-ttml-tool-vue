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
  .p-card-body {
    padding: 0.2rem 0;
  }
  .p-card-content {
    height: 8rem;
    display: flex;
    align-items: stretch;
    justify-content: flex-start;
  }
}
</style>
