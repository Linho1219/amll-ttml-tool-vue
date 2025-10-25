<template>
  <div class="content" selection-root @mousedown.self="handleMouseDown">
    <template v-for="(line, lineIndex) in coreStore.lyricLines" :key="line">
      <LineShell :line="line" :index="lineIndex">
        <WordInsertIndicator :index="0" :parent="line" />
        <template v-for="(word, wordIndex) in line.words" :key="word">
          <Word :word="word" :index="wordIndex" />
          <WordInsertIndicator :index="wordIndex + 1" :parent="line" />
        </template>
        <Button icon="pi pi-plus" severity="secondary" @click="appendWord(line)" />
      </LineShell>
    </template>
    <DragGhost v-if="runtimeStore.isDragging" />
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
import WordInsertIndicator from './WordInsertIndicator.vue'
import DragGhost from './DragGhost.vue'

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
