<template>
  <RibbonGroup label="性能">
    <div class="kvgrid" v-if="isSupported && memory" style="text-align: right">
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
