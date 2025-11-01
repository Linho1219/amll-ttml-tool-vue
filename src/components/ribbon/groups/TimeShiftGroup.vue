<template>
  <RibbonGroup label="时移">
    <Button icon="pi pi-wave-pulse" label="延迟测试" size="small" severity="secondary" />
    <div class="hflex" style="align-items: center; gap: 0.5rem">
      <span>延迟</span>
      <InputNumber
        class="durationinput"
        :useGrouping="false"
        style="width: 0; flex: 1"
        fluid
        size="small"
        placeholder="0"
        v-model="runtimeStore.globalLatency"
      />
    </div>
    <Button icon="pi pi-sliders-h" label="批量时移" size="small" severity="secondary" />
  </RibbonGroup>
</template>

<script setup lang="ts">
import { useRuntimeStore } from '@/stores/runtime'
import { Button, InputNumber } from 'primevue'
import RibbonGroup from '../RibbonGroupShell.vue'

const runtimeStore = useRuntimeStore()
</script>
