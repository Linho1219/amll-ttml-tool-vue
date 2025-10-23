<template>
  <div
    class="content"
    @click.self="(runtimeStore.selectedLines.clear(), runtimeStore.selectedWords.clear())"
  >
    <LineShell
      v-for="(line, index) in coreStore.lyricLines"
      :key="index"
      :line="line"
      :index="index"
    >
    </LineShell>
  </div>
</template>

<script setup lang="ts">
import { useCoreStore } from '@/stores/core'
import LineShell from './LineShell.vue'
import { useRuntimeStore } from '@/stores/runtime'

const coreStore = useCoreStore()
const runtimeStore = useRuntimeStore()
</script>

<style lang="scss">
.content {
  flex: 1;
  overflow: auto;
  display: flex;
  flex-direction: column;
}
</style>
