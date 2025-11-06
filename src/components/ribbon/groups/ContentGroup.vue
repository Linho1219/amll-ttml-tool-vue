<template>
  <RibbonGroup label="内容">
    <Button icon="pi pi-arrows-h" label="分词窗格" size="small" severity="secondary" />
    <Button icon="pi pi-search" label="查找替换" size="small" severity="secondary" />
    <Button icon="pi pi-info-circle" label="元数据" size="small" severity="secondary" />
  </RibbonGroup>
</template>

<script setup lang="ts">
import { Button } from 'primevue'
import RibbonGroup from '../RibbonGroupShell.vue'
</script>
