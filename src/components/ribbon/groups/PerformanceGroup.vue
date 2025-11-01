<template>
  <RibbonGroup label="性能">
    <div class="perfgrid" v-if="isSupported && memory">
      <span>已使用</span>
      <span class="monospace">{{ size(memory.usedJSHeapSize) }}</span>
      <span>已分配</span>
      <span class="monospace">{{ size(memory.totalJSHeapSize) }}</span>
      <span>帧速率</span>
      <span class="monospace">{{ fps }} FPS</span>
    </div>
  </RibbonGroup>
</template>

<script setup lang="ts">
import RibbonGroup from '../RibbonGroupShell.vue'
import { useMemory, useFps } from '@vueuse/core'

const fps = useFps()

function size(v: number) {
  const kb = v / 1024 / 1024
  return `${kb.toFixed(2)} MB`
}
const { isSupported, memory } = useMemory()
</script>

<style lang="scss">
.perfgrid {
  display: grid;
  font-family: var(--font-monospace);
  grid-template-columns: 3em 9ch;
  text-align: right;
  align-items: center;
  justify-items: stretch;
  row-gap: 0.3rem;
  column-gap: 0.5rem;
}
</style>
