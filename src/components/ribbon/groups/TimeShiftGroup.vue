<template>
  <RibbonGroup label="时移">
    <Button icon="pi pi-wave-pulse" label="延迟测试" size="small" severity="secondary" disabled />
    <div class="hflex" style="align-items: center; gap: 0.5rem">
      <span>延迟</span>
      <InputNumber
        class="durationinput"
        style="width: 0; flex: 1"
        fluid
        size="small"
        placeholder="0"
        v-model="configStore.globalLatency"
      />
    </div>
    <Button icon="pi pi-sliders-h" label="批量时移" size="small" severity="secondary" disabled />
  </RibbonGroup>
</template>

<script setup lang="ts">
import { Button, InputNumber } from 'primevue'
import RibbonGroup from '../RibbonGroupShell.vue'
import { usePreferenceStore } from '@/stores/preference'

const configStore = usePreferenceStore()
</script>
