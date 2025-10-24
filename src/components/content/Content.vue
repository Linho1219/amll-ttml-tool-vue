<template>
  <div class="content" selection-root @mousedown.self="handleMouseDown">
    <LineShell
      v-for="(line, lineIndex) in coreStore.lyricLines"
      :key="lineIndex"
      :line="line"
      :index="lineIndex"
    >
      <template v-for="(word, wordIndex) in line.words">
        <Word :word="word" :index="wordIndex" />
      </template>
      <Button icon="pi pi-plus" severity="secondary" @click="appendWord(line)" />
    </LineShell>
  </div>
</template>

<script setup lang="ts">
import { useCoreStore, type LyricLine } from '@/stores/core'
import LineShell from './LineShell.vue'
import { useRuntimeStore } from '@/stores/runtime'
import Word from './ContentWord.vue'
import { Button } from 'primevue'
import { nextTick } from 'vue'
import { forceOutsideBlur } from '@/utils/selection'

const coreStore = useCoreStore()
const runtimeStore = useRuntimeStore()

function appendWord(line: LyricLine) {
  const newWord = coreStore.newWord(line)
  line.words.push(newWord)
  nextTick(() => runtimeStore.wordHooks.get(newWord)?.focusInput())
}
function handleMouseDown(e: MouseEvent) {
  if (e.ctrlKey || e.metaKey) return
  forceOutsideBlur()
  runtimeStore.selectedLines.clear()
  runtimeStore.selectedWords.clear()
}
</script>

<style lang="scss">
.content {
  flex: 1;
  overflow: auto;
  display: flex;
  flex-direction: column;
}
</style>
