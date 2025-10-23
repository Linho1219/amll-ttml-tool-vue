<template>
  <div
    class="content"
    @click.self="(runtimeStore.selectedLines.clear(), runtimeStore.selectedWords.clear())"
  >
    <LineShell
      v-for="(line, lineIndex) in coreStore.lyricLines"
      :key="lineIndex"
      :line="line"
      :index="lineIndex"
    >
      <Word v-for="(word, wordIndex) in line.words" :word="word" :index="wordIndex" />
    </LineShell>
  </div>
</template>

<script setup lang="ts">
import { useCoreStore } from '@/stores/core'
import LineShell from './LineShell.vue'
import { useRuntimeStore } from '@/stores/runtime'
import Word from './ContentWord.vue'

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
