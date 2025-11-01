<template>
  <RibbonGroup label="内容处理">
    <Button
      icon="pi pi-arrow-up-right-and-arrow-down-left-from-center"
      label="全文分词"
      size="small"
      severity="secondary"
    />
    <Button icon="pi pi-arrows-h" label="行分词" size="small" severity="secondary" />
    <Button icon="pi pi-search" label="查找替换" size="small" severity="secondary" />
  </RibbonGroup>
</template>

<script setup lang="ts">
import { Button } from 'primevue'
import RibbonGroup from '../RibbonGroupShell.vue'
</script>
